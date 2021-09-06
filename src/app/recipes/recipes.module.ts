import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipeSearchResultsComponent} from "./recipe-search-results/recipe-search-results.component";
import {RecipesComponent} from "./recipes.component";
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";
import {RecipeComponent} from "./recipe/recipe.component";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {RecipesRoutingModule} from "./recipes-routing.module";
import {NgxPaginationModule} from 'ngx-pagination';


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
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RecipesRoutingModule
  ],

  providers: []
})

export class RecipesModule{}
