import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { RecipeModel } from '../recipes/models/recipe.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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

  //Recipe service
  fetchBookmarks() {
    // @ts-ignore
    this.currentUser.subscribe((user) => (this.currentUserID = user.id));

    /*this.http
      .get('http://127.0.0.1:8000/api/bookmark')
      .subscribe((res: any) => {
        if (res?.split('<>').length > 0) {
          const bookmarks = res.split('<>');
          bookmarks.pop();
          this.recipesService.myBookmarks = bookmarks.map((bkm: string) =>
            JSON.parse(bkm)
          );
          this.recipesService.myBookmarksUpdated.next(
            this.recipesService.myBookmarks
          );
        } else {
          this.recipesService.myBookmarks = [];
          this.recipesService.myBookmarksUpdated.next(
            this.recipesService.myBookmarks
          );
        }
      });*/
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

  //Header component
  fetchMyRecipes() {
    this.recipesService.loadSpinner.next(true);
    this.http.get('http://127.0.0.1:8000/api/my-recipe').subscribe(
      (res: any) => {
        let myRecipes = res.split('<>');
        myRecipes.pop();
        myRecipes = myRecipes.map((recipe: string) => JSON.parse(recipe));
        this.recipesService.loadSpinner.next(false);
        this.recipesService.myRecipeSearch.next(myRecipes);
        //Store my recipes in recipes service
        this.recipesService.myRecipes = myRecipes;
      },
      (error) => {
        this.recipesService.loadSpinner.next(false);
        this.recipesService.myRecipes = [];
        this.recipesService.myRecipeSearch.next([]);
      }
    );
  }

  //Add recipe component
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
  }
}
