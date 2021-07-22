import { NgModule } from '@angular/core';
import {RecipesComponent} from "./recipes/recipes.component";
import {RouterModule, Routes} from "@angular/router";
import {RecipeComponent} from "./recipes/recipe/recipe.component";
import {AddRecipeComponent} from "./recipes/add-recipe/add-recipe.component";
import {LoginFormComponent} from "./auth/login-form/login-form.component";
import {RegisterFormComponent} from "./auth/register-form/register-form.component";
import {RecipesResolverService} from "./recipes/recipes-resolver.service";
import {AuthGuard} from "./auth/auth.guard";
import {RecipeFormGuard} from "./recipes/recipe-form.guard";

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
    canActivate: [AuthGuard],
    children: [
      {path:'', component:RecipeComponent,pathMatch: 'full'},
      {path:'my-recipes', component:RecipeComponent},
      {path:'add-recipe', component:AddRecipeComponent, canDeactivate: [RecipeFormGuard]},
      {path:'edit/:id', component:AddRecipeComponent, canDeactivate: [RecipeFormGuard]},
      {path:':id', component:RecipeComponent},
    ],
  },

  {path:'login', component: LoginFormComponent},
  {path:'registration', component: RegisterFormComponent},
  {path: '**', redirectTo: '/recipes',},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
