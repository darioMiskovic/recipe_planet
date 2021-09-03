export interface RecipeModel{
  id?: number;
  recipe_key: string;
  publisher: string;
  title: string;
  image_url: string;
  userId?: string;
  my_recipe?: boolean;
}
