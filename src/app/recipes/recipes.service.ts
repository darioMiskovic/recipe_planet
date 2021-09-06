import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {RecipeModel} from "./models/recipe.model";
import {RecipeInfoModel} from "./models/recipeInfo.model";

@Injectable({providedIn: "root"})

export class RecipesService {

  private defaultMyRecipeObj: RecipeInfoModel = {
    cooking_time: 0,
    image_url: "",
    ingredients: [],
    publisher: "",
    recipe_key: "",
    num_servings: 0,
    source_url: "",
    title: ""
  }

  recipeSearch = new Subject<RecipeModel[]>();
  myRecipeSearch =  new Subject<RecipeInfoModel[]>();
  myBookmarksUpdated = new BehaviorSubject(this.myBookmarks);
  loadSpinner = new BehaviorSubject(false);
  currentMyRecipe = new BehaviorSubject<RecipeInfoModel>(this.defaultMyRecipeObj);

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
