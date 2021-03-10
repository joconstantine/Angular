import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
@Injectable()
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] =[
        new Recipe('A Test Recipe', 
            'This is simply a test', 
            'https://www.aspicyperspective.com/wp-content/uploads/2017/03/asian-stir-fried-mushrooms-11-256x256.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe('Another Test Recipe', 
            'This is simply another test', 
            'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ])
      ];

      constructor(private slService: ShoppingListService) {}

      getRecipes() {
          return this.recipes.slice();//return another array with the exact content
      }

      addIngredientsToShoppingList(ingredients: Ingredient[])
      {
        this.slService.addIngredients(ingredients);
      }
}