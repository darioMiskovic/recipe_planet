import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Subscription } from 'rxjs';
import { RecipeModel } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-search-results',
  templateUrl: './recipe-search-results.component.html',
  styleUrls: ['./recipe-search-results.component.scss'],
})
export class RecipeSearchResultsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  recipesArray!: RecipeModel[];
  loadingSpinner = false;
  errorMsg = false;
  page: number = 1;
  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    const subscriber1 = this.recipeService.loadSpinner.subscribe((res) => {
      this.loadingSpinner = res;
    });

    const subscriber2 = this.recipeService.recipeSearch.subscribe(
      (recipeArr) => {
        recipeArr.length < 1 ? (this.errorMsg = true) : (this.errorMsg = false);
        this.page = 1;
        this.recipesArray = recipeArr;
      }
    );

    const subscriber3 = this.recipeService.myRecipeSearch.subscribe(
      (recipeArr) => {
        recipeArr.length < 1 ? (this.errorMsg = true) : (this.errorMsg = false);
        this.page = 1;
        this.recipesArray = recipeArr;
      }
    );

    this.subscription.add(subscriber1);
    this.subscription.add(subscriber2);
    this.subscription.add(subscriber3);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
