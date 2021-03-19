import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from "@angular/router";
import { ExecOptionsWithStringEncoding } from "node:child_process";
import { AnonymousSubject } from "rxjs/internal/Subject";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;

}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    

    constructor(private http: HttpClient,
        private router: Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBL8ipvo83agLNuB7mWThn5f-J78bcb2Bs',
            {
                email: email,
                password: password,
                returnSecureToken: true

            }
        ).pipe(catchError(this.handleError), 
        tap(
            resData => {
                this.handleAuthentication(resData.email, resData.localId,
                    resData.idToken, +resData.expiresIn);
            }
        ));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBL8ipvo83agLNuB7mWThn5f-J78bcb2Bs',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), 
        tap(
            resData => {
                this.handleAuthentication(resData.email, resData.localId,
                    resData.idToken, +resData.expiresIn);
            }
        ));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);//clear the timeout
        }
    }

    private handleAuthentication(email: string, id: string, 
        token: string, expiresIn: number) {
        //current time + expiresIN (seconds) * 1000 
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
            
        const user = new User(
            email, id, 
            token, expirationDate
        );

        this.user.next(user);
        this.autoLogout(expiresIn * 1000);//expiresIN is in seconds
        localStorage.setItem('userData', JSON.stringify(user)); // Save to the local storage of the browser
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email, userData.id,
            userData._token, new Date(userData._tokenExpirationDate)
        );
        
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - 
                new Date().getTime(); // getTime returns milliseconds
            
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }
        return throwError(errorMessage);
    }
}