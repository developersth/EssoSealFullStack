import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user${id}`);
  }

  createUser(user: User): Observable<User> {
    const body ={
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role:{
        name: user.role
      }
    }
    return this.http.post<User>(`${this.apiUrl}/user`, body);
  }

  updateUser(id:string,user: User): Observable<User> {
    const body ={
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role:{
        name: user.role
      }
    }
    return this.http.put<User>(`${this.apiUrl}/user/${id}`, body);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}
