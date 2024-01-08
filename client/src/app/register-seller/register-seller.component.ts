import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-seller',
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.scss'],
})
export class RegisterSellerComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private RegisterService: RegisterService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['seller', Validators.required],
    });
  }

  register() {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;
      this.RegisterService.register(userData).subscribe(
        (response) => {
          console.log('Regjistrimi u krye me sukses!', response);
          this.router.navigate(['/login']);
          alert('Regjistrimi u krye me sukses!');
        },
        (error) => {
          console.error('Gabim gjatë regjistrimit:', error);
        }
      );
    }
  }
}
