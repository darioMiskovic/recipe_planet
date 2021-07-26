import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes.component";
import {RecipesResolverService} from "./recipes-resolver.service";
import {AuthGuard} from "../auth/auth.guard";
import {RecipeComponent} from "./recipe/recipe.component";
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";
import {RecipeFormGuard} from "./recipe-form.guard";

const routes: Routes = [
  {
    path: '',
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
  }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class RecipesRoutingModule{}
