import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

function matchControls(matchingControlName: string): ValidatorFn {
  return (control: AbstractControl) => {
    const matchingControl = control.parent?.get(matchingControlName);
    if (!control || !matchingControl) return null;

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, matchControls('password')],
      }),
    }),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[0-9]{5}$')],
      }),
    }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', {
      validators: [Validators.required],
    }),
    terms: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
    source: new FormArray<FormControl<boolean | null>>([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
  });

  onSubmit() {
    const email = this.form.controls.email.value;
    const password = this.form.value.passwords?.password;
    console.log(this.form.value);
  }

  onReset() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
