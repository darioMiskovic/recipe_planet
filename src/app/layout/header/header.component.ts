import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RecipesService} from "../../recipes/recipes.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {UserModel} from "../../recipes/models/user.model";
import {RecipeModel} from "../../recipes/models/recipe.model";
import {Router} from "@angular/router";
import {DataStorageService} from "../../shared/data-storage.service";

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

  constructor(
    private recipesService: RecipesService,
    private http: HttpClient,
    private router: Router,
    private dataStorage: DataStorageService
  ) { }

  ngOnInit(): void {

   this.subscription = this.dataStorage.currentUser.subscribe(user => {
     this.activeToken = localStorage.getItem('token') !== null;
     this.currentUser = user!;
    })

     this.recipesService.myBookmarksUpdated.subscribe((res: RecipeModel[]) => {
      this.bookmarks = res;
    })
  }

  //Search recipe
  onSearch(form: NgForm){
    this.recipesService.loadSpinner.next(true);
    const query = form.value.searchValue;
    this.http.get('https://forkify-api.herokuapp.com/api/v2/recipes?search=' + query).subscribe((res: any) => {
      this.recipesService.loadSpinner.next(false);
      this.recipesService.recipeSearch.next(res.data.recipes);
      this.form.reset();
    }, error => {
      console.log(error);
      //API doesnt provide ERROR Message
    });
  }

  //Fetch my recipes
  onFetchMyRecipes(){
    this.dataStorage.fetchMyRecipes();
  }

  onLogout(){
    localStorage.removeItem('token');
    this.activeToken = false;
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
