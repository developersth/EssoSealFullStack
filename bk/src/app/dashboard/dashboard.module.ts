import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashBoardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DashBoardRoutingModule,
    NgModule,
    FormsModule,
    NgbModal
  ],
  exports: [],
  declarations: [
    DashboardComponent
  ],
  providers: [],
})
export class DashboardModule { }
