import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  password = '';
  username = '';
  emptyValues = false;
  login() {
    if (this.username.length !== 0 && this.password.length !== 0) {
      this.emptyValues = false;
      this.authService.login(this.username, this.password).subscribe(
        (data) => {
          localStorage.setItem('token', JSON.stringify(data));
          this.router.navigateByUrl('/dashboard');
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.emptyValues = true;
    }
  }
}
