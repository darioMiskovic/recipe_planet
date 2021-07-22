import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RecipeInfoModel} from "../models/recipeInfo.model";
import {IngredientInfoModel} from "../models/ingredientInfo.model";
import {RecipesService} from "../recipes.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DataStorageService} from "../../shared/data-storage.service";


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
              private recipeService: RecipesService,
              private dataStorage: DataStorageService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.init();
    this.subscription =this.dataStorage.currentUser.subscribe(res => {
      // @ts-ignore
      this.currentUserID = res.id;
    })

    this.route.params.subscribe(param => {
      if(param.id){
        this.editMyRecipe(param.id);
      }else{
        this.dataStorage.fetchMyRecipes();
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
    return this.recipeForm.get('ingredients') as FormArray;
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


  onDeleteIngredient(id: number){
    this.ingredients.controls.splice(id,1);
    this.recipeForm.setControl('ingredients', this.ingredients);
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

  myRecipeResponse(response: any){
      this.spinner = false;
      this.message = response.resMessage;
      setTimeout(()=>{
        if(response.type === 'added'){
          this.init();
          this.message = '';
        }else{
          this.updateRecipe = false;
          this.message = '';
          this.init();
          response.deleteRecipe ?
            this.router.navigate(['recipes','add-recipe']) : this.router.navigate(['recipes', response.recipeID]);
        }
      }, 1500)
  }

  //Submit Form
  onSubmit(){
    this.spinner = true;
    const myRecipe: RecipeInfoModel = this.recipeForm.getRawValue();

    myRecipe.ingredients = this.convertToIngrInfo(myRecipe);
    myRecipe.myRecipe = true;
    myRecipe.id =  "#"+(Math.random() * 1).toString().split('.')[1].split('').slice(0,6).join("");

    this.dataStorage.myRecipesUpdate(this.updateRecipe, myRecipe, this.recipeID)
      .subscribe(res => {
        this.myRecipeResponse(res);
      }, error => {
          console.log(error);
          this.spinner = false;
      });
  }


  //Delete MyRecipe
  onDeleteMyRecipe(){
    const unUsedMyRecipeObject = {
      publisher: '',
      ingredients: [],
      source_url: '',
      image_url: '',
      id: '',
      title: '',
      servings: 99,
      cooking_time: 99,
      myRecipe: true
    }
    this.dataStorage.myRecipesUpdate(true, unUsedMyRecipeObject, this.recipeID, true )
      .subscribe(res => {
        this.myRecipeResponse(res);
      }, error => {
        console.log(error);
        this.spinner = false;
      });
  }
}
