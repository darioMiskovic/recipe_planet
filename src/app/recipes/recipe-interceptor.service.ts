import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {RecipesService} from "./recipes.service";
import {exhaustMap, map, take} from "rxjs/operators";
import {DataStorageService} from "../shared/data-storage.service";

@Injectable()
export class RecipeInterceptorService implements HttpInterceptor{
  constructor(private recipeService: RecipesService, private dataStorage: DataStorageService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localhost = "https://localhost:44317/";

    // if(req.url !== localhost+'api/Account/register' && req.url !== localhost+'api/Account/user/' && req.url !== localhost+'api/Account/login'){
    //  const userID = (this.dataStorage.currentUserID).toString();
    //
    //   let clonedReq;
    //   if(req.method === 'POST'){
    //     clonedReq = req.clone({
    //       headers: req.headers.set("currentUserID", userID),
    //       responseType:'text'
    //     });
    //   }else {
    //    clonedReq = req.clone({
    //       headers: req.headers.set("currentUserID", userID),
    //     });
    //   }
    //
    //   return next.handle(clonedReq);
    //
    // }else{
    //   return next.handle(req);
    // }

    return next.handle(req);
  }

}

