import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipeSearchResultsComponent} from "./recipe-search-results/recipe-search-results.component";
import {RecipesComponent} from "./recipes.component";
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";
import {RecipeComponent} from "./recipe/recipe.component";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations:[
    RecipeComponent,
    RecipesComponent,
    AddRecipeComponent,
    RecipeSearchResultsComponent
  ],

  imports:[
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
})

export class RecipesModule{}
