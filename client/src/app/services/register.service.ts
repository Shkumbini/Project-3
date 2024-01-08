import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http
      .post('http://localhost:3000/api/ecommerce/create_user', user)
      .pipe(
        catchError((error) => {
          console.error('Gabim gjatë regjistrimit', error);
          throw error;
        })
      );
  }
}
