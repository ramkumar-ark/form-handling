import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  const value = control.value;
  if (value && !value.includes('?')) return { mustContainQuestionMark: true };
  return null;
}

let savedEmailValue = '';
const savedLoginForm = window.localStorage.getItem('saved-login-form');
if (savedLoginForm) {
  const parsedForm = JSON.parse(savedLoginForm);
  savedEmailValue = parsedForm.email || '';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(savedEmailValue, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      window.localStorage.setItem(
        'saved-login-form',
        JSON.stringify({ email: value.email })
      );
    });
  }

  get isEmailInvalid(): boolean {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get isPasswordInvalid(): boolean {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    console.log(this.form);
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log(`Email: ${email}, Password: ${password}`);
    console.log(this.form.get('email'));
  }
}
