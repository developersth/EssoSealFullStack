import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class AuthService {
  token: string;
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = "jwt";
  //public isLoggedIn: boolean = false; // กำหนดสถานะล็อกอินเริ่มต้นเป็น false
  public redirectUrl: string; // กำหนดตัวแปรสำหรับเก็บ url ที่จะลิ้งค์ไป

  constructor(private http: HttpClient) {}
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(username: string, password: string): Observable<string> {
    const payload = { username, password };
    console.log(payload);
    let data: any = [];
    return this.http.post<string>(`${this.apiUrl}/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  login(username: string, password: string):Observable<string> {
    const payload = { username, password };
    return this.http.post(this.apiUrl + "/login", payload).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null;
    //return true;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }




}
