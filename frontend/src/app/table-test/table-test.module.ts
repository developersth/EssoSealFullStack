import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableTestRoutingModule } from './table-test-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import { TableTestComponent } from './table-test.component';
import { FormsModule } from '@angular/forms'
import {TableModule} from 'primeng/table';
@NgModule({
    imports: [
        CommonModule,
        TableTestRoutingModule,
        NgxDatatableModule,
        InputTextModule,
        FormsModule,
        TableModule
    ],
    declarations: [
        TableTestComponent
    ]
})
export class TableTestModule { }
