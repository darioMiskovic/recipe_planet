import {RecipeInfoModel} from "./recipeInfo.model";
import {RecipeModel} from "./recipe.model";

export interface UserModel{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  my_recipes: RecipeInfoModel[];
  bookmarks?: string;
  favorites: RecipeModel[];

}

