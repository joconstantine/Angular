import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, 
    Router, 
    RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { User } from "./user.model";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router,
        private store: Store<fromApp.AppState>) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): boolean 
        | Promise<boolean> 
        | Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(
            (user: User) => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/auth']);
                }
            }
        ));// user is already an Observable
    }
    
}