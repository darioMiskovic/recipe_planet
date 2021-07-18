import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipeSearchResultsComponent} from "./recipe-search-results/recipe-search-results.component";
import {RecipesComponent} from "./recipes.component";
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";
import {RecipeComponent} from "./recipe/recipe.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {RecipeInterceptorService} from "./recipe-interceptor.service";

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

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RecipeInterceptorService,
      multi: true
    }
  ]
})

export class RecipesModule{}
