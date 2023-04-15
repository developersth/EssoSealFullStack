import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Truck } from './truck.model';
import { environment } from "environments/environment";

@Injectable()
export class TruckService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(this.apiUrl+'/trucks');
  }

  getTruck(id: number): Observable<Truck> {
    return this.http.get<Truck>(`${this.apiUrl}+'/trucks/'${id}`);
  }

  addTruck(truck: Truck): Observable<Truck> {
    return this.http.post<Truck>(this.apiUrl+'/trucks', truck);
  }

  updateTruck(id:string,truck:Truck): Observable<Truck> {
    return this.http.put<Truck>(`${this.apiUrl}+'/trucks'/${id}`, truck);
  }

  deleteTruck(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/+'/trucks/'${id}`);
  }
}
