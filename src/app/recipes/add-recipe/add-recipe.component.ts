import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeInfoModel} from "../models/recipeInfo.model";
import {IngredientInfoModel} from "../models/ingredientInfo.model";
import {HttpClient} from "@angular/common/http";
import {RecipesService} from "../recipes.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {


  recipeForm!: FormGroup;
  subscription = new Subscription();
  currentUserID!: number;
  updateRecipe = false;
  recipeID!: number;
  spinner = false;
  message!: string;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private recipeService: RecipesService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.init();
    this.subscription =this.recipeService.currentUser.subscribe(res => {
      // @ts-ignore
      this.currentUserID = res.id;
    })

    this.route.params.subscribe(param => {
      if(param.id){
        this.editMyRecipe(param.id);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //Edit recipe
  editMyRecipe(id: string){
   this.recipeID = this.recipeService.myRecipes.findIndex((recipe: RecipeInfoModel) => recipe.id === id);
   const myRecipe = this.recipeService.myRecipes[this.recipeID];

   const stringifyIngrArr = myRecipe.ingredients.map(ingr => Object.values(ingr).join(','));

   this.recipeForm.patchValue({
     title: myRecipe.title,
     source_url: myRecipe.source_url,
     image_url: myRecipe.image_url,
     publisher: myRecipe.publisher,
     cooking_time: myRecipe.cooking_time,
     servings: myRecipe.servings,
   })

    this.recipeForm.setControl('ingredients', this.setExistingIngredients(stringifyIngrArr));
    this.updateRecipe = true;

  }


  //Init Form
  init(){
   this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      source_url: ['', Validators.required],
      image_url: ['', Validators.required],
      publisher: ['', Validators.required],
      cooking_time: ['', Validators.required],
      servings: ['', Validators.required],
      ingredients: this.fb.array([
       this.fb.control('', Validators.required),
     ])
    });
  }

  get ingredients(){
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  setExistingIngredients(ingredients: string[]): FormArray{
    const formArray = this.fb.array([]);
    ingredients.forEach(ingr => {
      formArray.push(this.fb.control(ingr,Validators.required));
    })

    return formArray;
  }

  //Convert to valid ingr object
  convertToIngrInfo(ingrArr: RecipeInfoModel): IngredientInfoModel[]{
    const newIngredientsArray: IngredientInfoModel[] = ingrArr.ingredients.map((string: any) => {
      // @ts-ignore
      const ingrObj: IngredientInfoModel = {};
      const key = ['quantity','unit','description']
      const stringSplitArr = string.split(',');
      const ingrInfoArr = [stringSplitArr[0], stringSplitArr[1], stringSplitArr.slice(2, stringSplitArr.length).join()];

      ingrInfoArr.forEach((ingr, index) => {
        // @ts-ignore
        ingrObj[key[index]] = ingr;
      })
      return ingrObj;
    });
    return newIngredientsArray;
  }

  //Submit Form
  onSubmit(){
    this.spinner = true;
    const myRecipe: RecipeInfoModel = this.recipeForm.getRawValue();

    myRecipe.ingredients = this.convertToIngrInfo(myRecipe);
    myRecipe.myRecipe = true;
    myRecipe.id =  "#"+(Math.random() * 1).toString().split('.')[1].split('').slice(0,6).join("");

    if(this.updateRecipe){

      this.recipeService.myRecipes[this.recipeID] = myRecipe;
      const updatedMyRecipesArr = this.recipeService.myRecipes.map(recipe => JSON.stringify(recipe)+'<>').join('');

      this.http.post('http://127.0.0.1:8000/api/my-recipe/update', {

        my_recipe: updatedMyRecipesArr,
        currentUserID: this.currentUserID

      }).subscribe((res:any) => {
        console.log(res);
        this.spinner = false;
        this.message = res;
        setTimeout(()=>{
        this.router.navigate(['recipes','add-recipe'])
        }, 1500)
      }, error => {
        console.log(error);
        this.spinner = false;
      })

      this.updateRecipe = false;
      return;

    }



    this.http.post('http://127.0.0.1:8000/api/my-recipe', {

      my_recipe: (JSON.stringify(myRecipe)+'<>'),
      currentUserID: this.currentUserID

    }).subscribe((res:any) => {
      console.log(res);
      this.spinner = false;
      this.message = res;
      setTimeout(()=>{
      this.recipeForm.reset();
      this.message = '';
      }, 1500)
    }, error => {
      console.log(error)
      this.spinner = false;
    })

  }

}
