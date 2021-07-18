import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {RecipesService} from "./recipes.service";
import {exhaustMap, map, take} from "rxjs/operators";

@Injectable()
export class RecipeInterceptorService implements HttpInterceptor{
  constructor(private recipeService: RecipesService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localhost = "http://127.0.0.1:8000/api/";

    if(req.url !== localhost+'register' && req.url !== localhost+'user'){
     const userID = (this.recipeService.currentUserID).toString();

      const clonedReq = req.clone({
        headers: req.headers.set("currentUserID", userID)
      });

      return next.handle(clonedReq);

    }else{
      return next.handle(req);
    }

  }
}

