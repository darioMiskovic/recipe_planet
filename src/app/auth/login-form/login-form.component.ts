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
     username: loginForm.value.email,
     password: loginForm.value.password,
     grant_type: 'password',
     client_id: 2,
     client_secret: 'NI6eKei5m2FanLdPSNsi22VMRquQKFkso0VW41tZ',
     scope: '*'
   }

    this.http.post('http://127.0.0.1:8000/oauth/token', data).subscribe((res: any) => {
      this.spinner = false;
      localStorage.setItem('token', res.access_token);
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
