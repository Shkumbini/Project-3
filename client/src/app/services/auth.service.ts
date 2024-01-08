import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/ecommerce/login', {
      email,
      password,
    });
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== undefined && token !== null;
  }
}
