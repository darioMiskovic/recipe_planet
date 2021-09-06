import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {DataStorageService} from "../shared/data-storage.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private router: Router,private jwtHelper: JwtHelperService, private dataStorage: DataStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('token');

    if(idToken){

      if(this.jwtHelper.isTokenExpired(idToken)){
        alert("Your session is expired, please login");
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.dataStorage.tokenExpired.next(true);
      }
      return next.handle(req);
    }else{
     return  next.handle(req);
    }

    return  next.handle(req);
  }
}


