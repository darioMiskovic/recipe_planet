import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  spinner = false;
  message!: string;
  errorMsg = false;

  constructor(private http: HttpClient, private router: Router) { }

  responseAction(msg: string,  navigate = false, errorMsg = false){
    this.spinner = false;
    this.message = msg;
    this.errorMsg = errorMsg;
    setTimeout(()=>{
      this.message = '';
      this.errorMsg = false;
      if(navigate)this.router.navigate(['login']);
    }, 3000)
  }

  onSubmit(registerForm: NgForm){

    this.spinner = true;
    const formData = (registerForm.form.getRawValue());

    if(formData.password !== formData.password_confirmation){
      this.responseAction('Please enter password fields correctly', false, true);
      return;
    }

    this.http.post('https://localhost:44317/api/Account/register', formData, {responseType: 'text'}).subscribe(res => {
      this.responseAction('You have successfully registered', true);
    }, error => {

      let errorResponse = '';
      const objectError = JSON.parse(error.error);
      for (const property in objectError) {
        errorResponse += (`${objectError[property][0]}`);
      }

      this.responseAction(errorResponse,false, true);
    })
  }


}
