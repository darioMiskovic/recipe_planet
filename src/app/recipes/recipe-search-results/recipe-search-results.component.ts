import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipesService} from "../recipes.service";
import {Subscription} from "rxjs";
import {RecipeModel} from "../models/recipe.model";

@Component({
  selector: 'app-recipe-search-results',
  templateUrl: './recipe-search-results.component.html',
  styleUrls: ['./recipe-search-results.component.scss']
})
export class RecipeSearchResultsComponent implements OnInit, OnDestroy {

  subscriber = new Subscription();
  recipesArray!: RecipeModel[];
  loadingSpinner = false;
  errorMsg = false;
  constructor(private recipeService: RecipesService) {

  }


  ngOnInit(): void {

    this.subscriber = this.recipeService.loadSpinner.subscribe(res => {
      this.loadingSpinner = res;
    })

    //pokušati ispraviti na 1 subscriber****
   this.subscriber = this.recipeService.recipeSearch.subscribe(recipeArr => {
     recipeArr.length < 1 ? this.errorMsg = true: this.errorMsg = false;
     this.recipesArray = (recipeArr);
    })

    this.subscriber = this.recipeService.myRecipeSearch.subscribe(recipeArr => {
      recipeArr.length < 1 ? this.errorMsg = true: this.errorMsg = false;
      this.recipesArray = (recipeArr);
    })
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
