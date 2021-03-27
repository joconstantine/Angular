import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;

}

@Injectable()
export class AuthEffects {
    authLogin = createEffect(() => { 
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    map(resData => {
                        const expirationDate = new Date(
                            new Date().getTime() + +resData.expiresIn * 1000
                        );
                        return new AuthActions.Login({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.expiresIn,
                            expirationDate: expirationDate,
                        });
                    }),
                    catchError(error => {
                        // ...
                        const actions = new Array<Action>();
                        actions.push(new AuthActions.LoginError());
                        return actions;
                    })
                );
            }),
        );
    });

    constructor(
        private actions$: Actions,
        private http: HttpClient) {}

}