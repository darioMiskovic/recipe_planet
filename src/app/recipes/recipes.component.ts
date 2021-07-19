import {Component, OnDestroy, OnInit} from "@angular/core";
import {RecipesService} from "./recipes.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {UserModel} from "./models/user.model";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
})

export class RecipesComponent implements OnInit,OnDestroy {

  constructor(private recipeService: RecipesService,private route: ActivatedRoute,private http: HttpClient, private router: Router) {
  }

  ngOnInit() {

    // this.http.get('http://127.0.0.1:8000/api/user').subscribe((res: any) => {
    //  this.recipeService.currentUser.next(res);
    //   //fetch bookmarks
    //   this.recipeService.fetchBookmarks();
    // }, error => {
    //   console.log(error);
    //   localStorage.removeItem('token');
    //   this.router.navigate(['/login']);
    // })

    const currentUser = (this.route.snapshot.data['currentUser']);
    this.recipeService.currentUser.next(currentUser);
    this.recipeService.fetchBookmarks();
  }


ngOnDestroy() {

}


}
