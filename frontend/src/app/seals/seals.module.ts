import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SealinComponent } from './sealin/sealin.component';
import { SealoutComponent } from './sealout/sealout.component';
import { SealsRouteModule } from './seals-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';

@NgModule({
  declarations: [
    SealinComponent,
    SealoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SealsRouteModule,
    NgxDatatableModule,
    PipeModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class SealsModule { }
