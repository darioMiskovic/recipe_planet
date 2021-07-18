import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {RecipeModel} from "./models/recipe.model";
import {RecipeInfoModel} from "./models/recipeInfo.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({providedIn: "root"})

export class RecipesService {

  recipeSearch = new Subject<RecipeModel[]>();
  myRecipeSearch =  new Subject<RecipeInfoModel[]>();
  myBookmarksUpdated = new BehaviorSubject(this.myBookmarks);
  currentUser = new BehaviorSubject(null);

  currentUserID!: number;
  subscription = new Subscription();

  private _myBookmarks: RecipeModel[] = [];
  private _myRecipes!: RecipeInfoModel[];


  constructor(private http: HttpClient) {}


  get myBookmarks(): RecipeModel[] {
    return this._myBookmarks;

  }

  set myBookmarks(value: RecipeModel[]) {
    this._myBookmarks = value;
  }


  get myRecipes(): RecipeInfoModel[] {
    return this._myRecipes;
  }

  set myRecipes(value: RecipeInfoModel[]) {
    this._myRecipes = value;
  }

  //Fetch Bookmark's
  fetchBookmarks(){

    // @ts-ignore
    this.subscription = this.currentUser.subscribe(user => this.currentUserID = user.id)

    const headers = new HttpHeaders({
      'currentUserID': this.currentUserID.toString()
    });

    this.http.get("http://127.0.0.1:8000/api/bookmark",{headers}).subscribe((res: any) => {
      if (res?.split('<>').length > 0){
      const bookmarks = res.split('<>');
        bookmarks.pop();
        this.myBookmarks = bookmarks.map((bkm: string) => JSON.parse(bkm))
        this.myBookmarksUpdated.next(this.myBookmarks);
      }else{
        this.myBookmarksUpdated.next([]);
      }
    })
  }

  //Add Bookmark
  addBookmark(bookmark: RecipeModel){
    // @ts-ignore
    this.subscription = this.currentUser.subscribe(user => this.currentUserID = user.id)

    this.http.post('http://127.0.0.1:8000/api/bookmark', {
      bookmark: JSON.stringify(bookmark)+'<>',
      currentUserID: this.currentUserID
    }).subscribe((res:any) => {
      console.log(res);
      this._myBookmarks.push(bookmark);
      this.myBookmarksUpdated.next(this.myBookmarks);
    }, error => {
      console.log(error)
    })
  }

  removeBookmark(removeBookmarkID: string){
    const removeIndex = this.myBookmarks.findIndex(bookmark => bookmark.id === removeBookmarkID);
    this.myBookmarks.splice(removeIndex, 1);
    const bookmarksArrStringify = this.myBookmarks.map(bm => JSON.stringify(bm)+'<>').join('');

    this.http.post('http://127.0.0.1:8000/api/bookmark/delete', {
      bookmarks: bookmarksArrStringify
    }).subscribe((res:any) => {
      console.log(res);
      this.myBookmarksUpdated.next(this.myBookmarks);
    }, error => {
      console.log(error)
    })
  }
}
