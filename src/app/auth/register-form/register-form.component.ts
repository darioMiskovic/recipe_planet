import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(registerForm: NgForm){
    const formData = (registerForm.form.getRawValue());
    this.http.post('http://127.0.0.1:8000/api/register', formData, {responseType: 'text'}).subscribe(res => {
      alert("Your registration is successfull!");
      this.router.navigate(['login']);

    }, error => {
      console.log(error)
    })
  }

}
