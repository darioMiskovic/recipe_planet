import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(registerForm: NgForm){
    const formData = (registerForm.value);

    this.http.post('http://127.0.0.1:8000/api/register', formData).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error)
    })
  }

}
