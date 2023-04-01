import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SealInsRoutingModule } from './sealins-routing.module';
import { FormsModule } from '@angular/forms'
import {TableModule} from 'primeng/table';
import { SealinsComponent } from './sealins.component';
import {CalendarModule} from 'primeng/calendar';
@NgModule({
  declarations: [SealinsComponent],
  imports: [
    CommonModule,
    SealInsRoutingModule,
    TableModule,
    FormsModule,
    CalendarModule
    
  ]
})
export class SealinsModule { }
