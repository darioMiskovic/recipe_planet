import {Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipeInfoModel} from "../models/recipeInfo.model";
import {RecipesService} from "../recipes.service";
import {RecipeModel} from "../models/recipe.model";
import {Subscription} from "rxjs";
import {DataStorageService} from "../../shared/data-storage.service";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy {

  recipeStatus = false;
  myRecipe = false;
  recipeInfo!: RecipeInfoModel;
  bookmarks: RecipeModel[] = [];
  bookmarkID = false;
  subscription = new Subscription();
  spinner = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit(): void {

    this.subscription = this.recipeService.myBookmarksUpdated.subscribe((res: RecipeModel[]) => {
      if(res){
        this.bookmarks = res;
      }
    })

    this.route.params.subscribe(params => {
      if(params.id !== undefined){
        this.fetchRecipeDetail(params.id);
        if(this.bookmarks.length > 0){
          this.bookmarkID = this.bookmarks.some(recipe => recipe.recipe_key === params.id)
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchRecipeDetail(id: string){
    this.spinner = true;
    this.recipeStatus = false;

    //My recipe
    if(id.includes('myrecipe')){
      const myRecipe = this.recipeService.myRecipes.find((recipe: RecipeInfoModel) => recipe.recipe_key === id);
      if(myRecipe){
        // @ts-ignore
        this.dataStorage.fetchMyRecipeInfo(myRecipe.id).subscribe(data => {
          this.spinner = false;
          this.recipeInfo = data;
          this.recipeStatus = true;
          this.myRecipe = true;
        });
      }
      return;
    }

    this.dataStorage.fetchRecipeDetail(id).subscribe(recipe => {
      this.spinner = false;
      this.recipeInfo = recipe;
      this.recipeStatus = true;
      this.myRecipe = false;
    },error => {
        console.log(error)
        this.recipeStatus = false;
    })
  }

  onBookmark(){
    //Add bookmark
    if(!this.bookmarkID){
      this.bookmarkID = !this.bookmarkID;
      const recipe: RecipeModel = {
        publisher: this.recipeInfo.publisher,
        title: this.recipeInfo.title,
        recipe_key: this.recipeInfo.recipe_key,
        image_url: this.recipeInfo.image_url
      }
      this.dataStorage.addBookmark(recipe);
    }else{
      this.bookmarkID = !this.bookmarkID;
      const bookmark = this.bookmarks.find(bk => bk.recipe_key === this.recipeInfo.recipe_key);
      if(bookmark?.id != null) this.dataStorage.removeBookmark(bookmark.id);
  }
  }
}
