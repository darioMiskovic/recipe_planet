import {Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RecipeInfoModel} from "../models/recipeInfo.model";
import {RecipesService} from "../recipes.service";
import {RecipeModel} from "../models/recipe.model";
import {Subscription} from "rxjs";

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private recipeService: RecipesService) { }

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
          this.bookmarkID = this.bookmarks.some(recipe => recipe.id === params.id)
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchRecipeDetail(id: string){

    if(id[0] === '#'){
      const myRecipeInfo = this.recipeService.myRecipes.find((recipe: RecipeInfoModel) => recipe.id === id)
      if(myRecipeInfo){
        this.recipeInfo = myRecipeInfo;
        this.recipeStatus = true;
        this.myRecipe = true;
      }
      return;
    }

    this.http.get(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`).subscribe((recipe: any) => {
      this.recipeInfo = recipe.data.recipe;
      this.recipeStatus = true;
    }, error => {
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
        id: this.recipeInfo.id,
        image_url: this.recipeInfo.image_url
      }

      this.bookmarks.push(recipe);
      this.recipeService.addBookmark(recipe);

    }else{
      this.bookmarkID = !this.bookmarkID;
      this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== this.recipeInfo.id);
      this.recipeService.removeBookmark(this.recipeInfo.id)
    }

  }


}
