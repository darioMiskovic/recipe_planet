import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";

@Injectable({
  providedIn: 'root'
})
export class RecipeFormGuard implements CanDeactivate<AddRecipeComponent> {
  canDeactivate(
    component: AddRecipeComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree {

    if(component.recipeForm.dirty){
      return confirm("Are you sure you want to discard you changes?");
    }
    return true;
  }

}
