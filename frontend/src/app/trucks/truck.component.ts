import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Truck } from './truck.model';

@Component({
  selector: 'app-truck',
  templateUrl: './truck.component.html',
  styleUrls: ['./truck.component.scss']
})
export class TruckComponent {
  trucks: Truck[];
  constructor(private http: HttpClient) { }
}
