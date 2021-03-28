import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';

import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipesEffects {
    fetchRecipes = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                    'https://ng-course-recipe-book-4649e-default-rtdb.firebaseio.com/recipes.json',
                );
            }),
            map(recipes => {//this is a rxjs method
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });//this is an array method
            }),
            map( recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        );
    });
    
    constructor(private actions$: Actions,
        private http: HttpClient) {}
}