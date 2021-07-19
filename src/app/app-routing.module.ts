import { NgModule } from '@angular/core';
import {RecipesComponent} from "./recipes/recipes.component";
import {RouterModule, Routes} from "@angular/router";
import {RecipeComponent} from "./recipes/recipe/recipe.component";
import {AddRecipeComponent} from "./recipes/add-recipe/add-recipe.component";
import {LoginFormComponent} from "./auth/login-form/login-form.component";
import {RegisterFormComponent} from "./auth/register-form/register-form.component";
import {RecipesResolverService} from "./recipes/recipes-resolver.service";

const routes: Routes = [

  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },

  {
    path: 'recipes',
    component: RecipesComponent,
    resolve: {currentUser: RecipesResolverService},
    children: [
      {path:'my-recipes', component:RecipeComponent},
      {path:'add-recipe', component:AddRecipeComponent},
      {path:'edit/:id', component:AddRecipeComponent},
      {path:':id', component:RecipeComponent},
    ],
  },

  {path:'login', component: LoginFormComponent},
  {path:'registration', component: RegisterFormComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
