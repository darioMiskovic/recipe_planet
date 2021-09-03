import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  spinner = false;
  errorMsg!: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(loginForm: NgForm){

    this.spinner = true;

   const data = {
     email: loginForm.value.email,
     password: loginForm.value.password
   }

    this.http.post('https://localhost:44317/api/Account/login', data).subscribe((res: any) => {
      this.spinner = false;
      localStorage.setItem('token', res.token);
      this.router.navigate(['/']);

    }, error => {
      console.log(error);
      this.spinner = false;
      this.errorMsg = 'Please enter valid inputs';
       setTimeout(()=> {
         this.errorMsg = '';
         loginForm.reset();
       }, 1500)
      })
  }

}
