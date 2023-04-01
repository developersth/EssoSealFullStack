import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { TablesRoutingModule } from "./tables-routing.module";

import { ExtendedTableComponent } from "./extended/extended-table.component";
import { RegularTableComponent } from "./regular/regular-table.component";

@NgModule({
    imports: [
        CommonModule,
        TablesRoutingModule,
    ],
    declarations: [
        ExtendedTableComponent,
        RegularTableComponent
    ]
})
export class TablesModule { }
