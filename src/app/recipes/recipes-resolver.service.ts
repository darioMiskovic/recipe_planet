import {UserModel} from "./models/user.model";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()

export class RecipesResolverService implements Resolve<UserModel>{
  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> | Promise<UserModel> | UserModel {

    return  this.http.get<UserModel>('http://127.0.0.1:8000/api/user');
  }
}
