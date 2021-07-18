import {IngredientInfoModel} from "./ingredientInfo.model";

export interface RecipeInfoModel{
  publisher: string;
  ingredients: IngredientInfoModel[];
  source_url: string;
  image_url: string;
  id: string;
  title: string;
  servings: number;
  cooking_time: number;
  myRecipe?: boolean;
}
