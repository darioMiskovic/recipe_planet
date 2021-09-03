import {IngredientInfoModel} from "./ingredientInfo.model";

export interface RecipeInfoModel{
  id?: number;
  recipe_key: string;
  publisher: string;
  title: string;
  image_url: string;
  source_url: string;
  ingredients: IngredientInfoModel[];
  servings: number;
  cooking_time: number;
  myRecipe?: boolean;
}
