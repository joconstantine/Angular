import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';

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
    

    constructor(private http: HttpClient) { }

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