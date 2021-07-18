import {Component, OnInit} from "@angular/core";
import {RecipesService} from "./recipes.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
})

export class RecipesComponent implements OnInit {

  constructor(private recipeService: RecipesService, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {

    this.http.get('http://127.0.0.1:8000/api/user').subscribe((res: any) => {
     this.recipeService.currentUser.next(res);
      //fetch bookmarks
      this.recipeService.fetchBookmarks();
    }, error => {
      console.log(error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    })
  }





}
