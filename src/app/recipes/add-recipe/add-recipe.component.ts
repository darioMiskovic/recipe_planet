import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RecipeInfoModel} from "../models/recipeInfo.model";
import {IngredientInfoModel} from "../models/ingredientInfo.model";
import {RecipesService} from "../recipes.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DataStorageService} from "../../shared/data-storage.service";

interface MyRecipeResponse {
  type: string;
  message: string;
  delete?: boolean;
  recipe_key?: string;
}

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {


  recipeForm!: FormGroup;
  subscription = new Subscription();
  updateRecipe = false;
  myRecipeId!: number;
  myRecipeKey!: string;
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

    this.subscription = this.recipeService.currentMyRecipe.subscribe(myRecipe => {
      if(myRecipe.id) this.myRecipeId = myRecipe.id;
      if(myRecipe.recipe_key) this.myRecipeKey = myRecipe.recipe_key;

      this.recipeForm.patchValue({
        title: myRecipe.title,
        source_url: myRecipe.source_url,
        image_url: myRecipe.image_url,
        publisher: myRecipe.publisher,
        cooking_time: myRecipe.cooking_time,
        num_servings: myRecipe.num_servings,
      })

       const stringifyIngrArr = myRecipe.ingredients.map(ingr => {
         return {
           id: ingr.id,
           ingString: `${ingr.quantity},${ingr.unit},${ingr.description}`
         }
       });

       this.recipeForm.setControl('ingredients', this.setExistingIngredients(stringifyIngrArr));
       this.updateRecipe = true;

    })

  }

  //Init Form
  init(){
   this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      source_url: ['', Validators.required],
      image_url: ['', Validators.required],
      publisher: ['', Validators.required],
      cooking_time: ['', Validators.required],
      num_servings: ['', Validators.required],
      ingredients: this.fb.array([
       //this.fb.control('', Validators.required),
        this.fb.group({
          id:null,
          ingredientInfo:['', Validators.required]
        })
     ])
    });
  }

  get ingredients(){
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(
      this.fb.group({
      id:null,
      ingredientInfo:['', Validators.required]
    })
    );
  }

  setExistingIngredients(ingredients: {id:number | undefined,ingString:string}[]): FormArray{
    const formArray = this.fb.array([]);
    ingredients.forEach(ingr => {
      formArray.push(
        //this.fb.control(ingr,Validators.required)
        this.fb.group({
          id:ingr.id,
          ingredientInfo:ingr.ingString
        })
      );
    })

    return formArray;
  }

  onDeleteIngredient(id: number, existingIngrId:number){

   const deleteIngr = [...this.ingredients.controls][id];
    if(deleteIngr.value.ingredientInfo == ""){
      //If there's no input value
      this.ingredients.controls.splice(id,1);
      this.recipeForm.setControl('ingredients', this.ingredients);
    }else if(existingIngrId == null){
      //If not ingredient from Database
      this.ingredients.controls.splice(id,1);
      this.recipeForm.setControl('ingredients', this.ingredients);
    } else{
      //If user want delete ingridient from Database
      const userAnswer = confirm("are you sure you want to delete the ingredient?");
      if(userAnswer){
        this.dataStorage.deleteIngredient(deleteIngr.value.id).subscribe(res => {
          this.ingredients.controls.splice(id,1);
          this.recipeForm.setControl('ingredients', this.ingredients);
        },
        error => console.log(error)
        );
      }
    }
  }

  //Convert to valid ingr object
  convertToIngrInfo(formIngr: {id:null | number, ingredientInfo: string}[] | IngredientInfoModel[]): IngredientInfoModel[]{
    const newIngredientsArray: IngredientInfoModel[] = formIngr.map((ingr: any) => {
      // @ts-ignore
      const ingrObj: IngredientInfoModel = {};
      const key = ['quantity','unit','description']
      const stringSplitArr = ingr.ingredientInfo.split(',');
      const ingrInfoArr = [stringSplitArr[0], stringSplitArr[1], stringSplitArr.slice(2, stringSplitArr.length).join()];

      ingrInfoArr.forEach((ingr, index) => {
        // @ts-ignore
        ingrObj[key[index]] = ingr;
      })
      if(ingr.id && this.updateRecipe){
        ingrObj.myRecipeId = this.myRecipeId;
        ingrObj.id = ingr.id;
      }
      return ingrObj;
    });
    return newIngredientsArray;
  }

  myRecipeResponse(response: MyRecipeResponse){
      this.spinner = false;
      this.message = response.message;
      setTimeout(()=>{
        if(response.type === 'added'){
          this.init();
          this.message = '';
        }else{
          this.updateRecipe = false;
          this.message = '';
          this.init();
          response.type === 'deleted' ?
            this.router.navigate(['recipes','add-recipe']) : this.router.navigate(['recipes', response.recipe_key]);
        }
      }, 1500)
  }

  //Submit Form
  onSubmit(){

    this.spinner = true;
    const myRecipe: RecipeInfoModel = this.recipeForm.getRawValue();
    myRecipe.ingredients = this.convertToIngrInfo(myRecipe.ingredients);
    myRecipe.my_recipe = true;

    if(!this.updateRecipe){
      //ADD MY RECIPE
      myRecipe.recipe_key =  "myrecipe"+(Math.random() * 1).toString().split('.')[1].split('').slice(0,6).join("");
      this.dataStorage.addMyRecipe(myRecipe).subscribe(
        (res: any) => {
          this.spinner = false;
          this.myRecipeResponse({type:'added', message:"Recipe is added successfully"})
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
     //UPDATE MY RECIPE
      myRecipe.recipe_key = this.myRecipeKey;
      this.dataStorage.updateMyRecipe(myRecipe, this.myRecipeId).subscribe(
        (res: any) => {
          this.spinner = false;
          this.myRecipeResponse({type:'updated', message:"Recipe is updated successfully",recipe_key: res.recipe_key})
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }


  //Delete MyRecipe
  onDeleteMyRecipe(){
    const userAnswer = confirm("are you sure you want to delete your recipe?")
    if(userAnswer){
      this.dataStorage.deleteMyRecipe(this.myRecipeId)
        .subscribe(res => {
          this.myRecipeResponse({type:'deleted', message:"Recipe is deleted successfully"})
        }, error => {
          console.log(error);
          this.spinner = false;
        });
    }
  }
}
