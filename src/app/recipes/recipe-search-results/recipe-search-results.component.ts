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

  constructor(private recipeService: RecipesService) { }


  ngOnInit(): void {

    //pokušati ispraviti na 1 subscriber****
   this.subscriber = this.recipeService.recipeSearch.subscribe(recipeArr => {
     this.loadingSpinner = false;
     this.recipesArray = (recipeArr);

    })

    this.subscriber = this.recipeService.myRecipeSearch.subscribe(recipeArr => {
      this.loadingSpinner = false;
      this.recipesArray = (recipeArr);
    })
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
