import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RecipesService} from "../../recipes/recipes.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {UserModel} from "../../recipes/models/user.model";
import {RecipeModel} from "../../recipes/models/recipe.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('f') form!: NgForm;
  subscription = new Subscription();
  currentUser!: UserModel;
  activeToken!:boolean;
  bookmarks!: RecipeModel[];

  constructor(private recipesService: RecipesService, private http: HttpClient) { }

  ngOnInit(): void {
    //Fetch current user
   this.subscription = this.recipesService.currentUser.subscribe(user => {
     this.currentUser = user!;
    })
    this.activeToken = localStorage.getItem('token') !== null;

    this.subscription = this.recipesService.myBookmarksUpdated.subscribe((res: RecipeModel[]) => {
      this.bookmarks = res;
    })
  }

  //Search recipe
  onSearch(form: NgForm){
    const query = form.value.searchValue;
    this.http.get('https://forkify-api.herokuapp.com/api/v2/recipes?search=' + query).subscribe((res: any) => {
      this.recipesService.recipeSearch.next(res.data.recipes);
      this.form.reset();

    }, error => {
      console.log(error);
      alert("We couldn't find recipes for this query!")
      this.form.reset();
    });
  }

  //Fetch my recipes
  onFetchMyRecipes(){
    const headers = new HttpHeaders({
      'currentUserID': (this.currentUser.id).toString()
    });

    this.http.get('http://127.0.0.1:8000/api/my-recipe', {headers: headers}).subscribe((res:any) => {
      let myRecipes = res.split('<>');
      myRecipes.pop();
      myRecipes = myRecipes.map((recipe: string) => JSON.parse(recipe));
      this.recipesService.myRecipeSearch.next(myRecipes);
      //Store my recipes in recipes service
      this.recipesService.myRecipes = myRecipes;
    }, error => {
      console.log(error)
    });
  }

  onLogout(){
    localStorage.removeItem('token');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
