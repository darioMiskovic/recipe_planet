import {UserModel} from "./models/user.model";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {DataStorageService} from "../shared/data-storage.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {RecipesService} from "./recipes.service";

@Injectable({
  providedIn: 'root'
})

export class RecipesResolverService implements Resolve<UserModel>{
  constructor(
    private http: HttpClient,
    private dataStorage: DataStorageService,
    private jwtHelper: JwtHelperService,
    private recipeService: RecipesService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> | Promise<UserModel> | UserModel {

    const token = localStorage.getItem('token')!;
    const userId = this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'][2];
    return this.http.get<UserModel>('https://localhost:44317/api/Account/user/'+userId).pipe(tap((user: any)=> {
      user.id = userId
      this.dataStorage.currentUser.next(user);
      this.recipeService.myBookmarks = user.favorites;
      this.recipeService.myBookmarksUpdated.next(user.favorites);
    }));


  }
}
