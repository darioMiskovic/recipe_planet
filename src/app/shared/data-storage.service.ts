import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { RecipeModel } from '../recipes/models/recipe.model';
import { BehaviorSubject } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { RecipeInfoModel } from '../recipes/models/recipeInfo.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  currentUser = new BehaviorSubject(null);
  currentUserID!: number;

  constructor(
    private http: HttpClient,
    private recipesService: RecipesService
  ) {}

  //Bookamarks (Favorites)
  fetchBookmarks() {
    // @ts-ignore
    this.currentUser.subscribe((user) => (this.currentUserID = user.id));

    this.http
      .get('https://localhost:44317/api/Account/my-favorites/'+this.currentUserID)
      .subscribe((bookmarks:any) => {

        this.recipesService.myBookmarks = bookmarks;
        this.recipesService.myBookmarksUpdated.next(bookmarks);

      });
  }

  addBookmark(bookmark: RecipeModel) {
    // @ts-ignore
    this.currentUser.subscribe((user) => (bookmark.userId = user.id));

    this.http
      .post('https://localhost:44317/api/Favorite/add-favorite-recipe', bookmark)
      .subscribe(
        (favoriteRecipe: any) => {
          console.log(favoriteRecipe);
          this.recipesService.myBookmarks.push(favoriteRecipe);
          this.recipesService.myBookmarksUpdated.next(
            this.recipesService.myBookmarks
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }

  removeBookmark(bookmarkId: number) {
    const removeIndex = this.recipesService.myBookmarks.findIndex(
      (bookmark) => bookmark.id === bookmarkId
    );
    this.recipesService.myBookmarks.splice(removeIndex, 1);
    this.http
      .delete('https://localhost:44317/api/Favorite/favorite-delete/'+bookmarkId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.recipesService.myBookmarksUpdated.next(
            this.recipesService.myBookmarks
          );
        },
        (error) => {
          console.log(error);
        }
      );

  }

  //Recipe component
  fetchRecipeDetail(id: string) {
    return this.http
      .get<RecipeInfoModel>(
        `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      )
      .pipe(
        map((recipe: any) => {
          const recipeInfo = {...recipe.data.recipe, recipe_key: recipe.data.recipe.id};
          return recipeInfo;
        })
      );
  }

  //Fetch My Recipes
  fetchMyRecipes() {
    this.recipesService.loadSpinner.next(true);

    this.http.get('https://localhost:44317/api/Account/my-recipes/'+this.currentUserID).subscribe(
      (myRecipes: any) => {
        this.recipesService.loadSpinner.next(false);
        this.recipesService.myRecipeSearch.next(myRecipes);
        this.recipesService.myRecipes = myRecipes;
      },
      (error) => {
        this.recipesService.loadSpinner.next(false);
        console.log(error)
      }
    );
  }

  //Fetch My Recipe Info
  fetchMyRecipeInfo(recipeId: number) {
   return  this.http.get<RecipeInfoModel>('https://localhost:44317/api/MyRecipe/my-recipe-info/'+recipeId);
  }

  //Add recipe component
  addMyRecipe(myRecipe: RecipeInfoModel) {

    this.currentUser.subscribe((user: any) => {
      if(user.id) (myRecipe.userId = user.id)
    });

   return  this.http
      .post('https://localhost:44317/api/MyRecipe/add-my-recipe/', myRecipe).pipe(tap((myRecipe: any) => {
      this.recipesService.myRecipes.push(myRecipe);
    }));
  }




  /*
  myRecipesUpdate(
    update: boolean,
    myRecipe: RecipeInfoModel,
    recipeID = 0,
    deleteMyRecipe = false
  ) {
    if (update) {
      if (deleteMyRecipe) {
        // const removeIndex = this.recipesService.myRecipes.findIndex(
        //   (recipe) => +recipe.id === recipeID
        // );
        //this.recipesService.myRecipes.splice(removeIndex, 1);
      } else {
        this.recipesService.myRecipes[recipeID] = myRecipe;
      }

      const updatedMyRecipesArr = this.recipesService.myRecipes
        .map((recipe) => JSON.stringify(recipe) + '<>')
        .join('');
      return this.http
        .post('http://127.0.0.1:8000/api/my-recipe/update', {
          my_recipe: updatedMyRecipesArr,
        })
        .pipe(
          map((response: any) => {
            return {
              type: response.split(' ')[2],
              resMessage: response,
              deleteRecipe: deleteMyRecipe,
              recipeID: myRecipe.id,
            };
          })
        );
    }

    this.recipesService.myRecipes.push(myRecipe);
    this.recipesService.myRecipeSearch.next(this.recipesService.myRecipes);
    return this.http
      .post('http://127.0.0.1:8000/api/my-recipe', {
        my_recipe: JSON.stringify(myRecipe) + '<>',
      })
      .pipe(
        map((response: any) => {
          return {
            type: response.split(' ')[3],
            resMessage: response,
          };
        })
      );
  }*/


}
