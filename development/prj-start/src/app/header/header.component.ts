import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component(
{
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    private userSub: Subscription;

    constructor(private dataStorageService: DataStorageService,
        private authService: AuthService,
        private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSub = this.store.select('auth')
        .pipe(
            map(authState => {
                return authState.user;
            })
        )
        .subscribe(
            user => {
                this.isAuthenticated = !!user; // = !user ? false : true;
                console.log(!user);
                console.log(!!user);
            }
        );
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
    
    onSaveData() {
        this.dataStorageService.storageRecipes();
    }

    onFetchData() {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogout() {
        // this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }
}