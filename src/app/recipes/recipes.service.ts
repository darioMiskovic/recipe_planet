import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {RecipeModel} from "./models/recipe.model";
import {RecipeInfoModel} from "./models/recipeInfo.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({providedIn: "root"})

export class RecipesService {

  recipeSearch = new Subject<RecipeModel[]>();
  myRecipeSearch =  new Subject<RecipeInfoModel[]>();
  myBookmarksUpdated = new BehaviorSubject(this.myBookmarks);
  loadSpinner = new BehaviorSubject(false);

  currentUserID!: number;

  private _myBookmarks: RecipeModel[] = [];
  private _myRecipes!: RecipeInfoModel[];

  get myBookmarks(): RecipeModel[] {
    return this._myBookmarks;
  }

  set myBookmarks(value: RecipeModel[]) {
    this._myBookmarks = value;
  }

  get myRecipes(): RecipeInfoModel[] {
    return this._myRecipes;
  }

  set myRecipes(value: RecipeInfoModel[]) {
    this._myRecipes = value;
  }

}
