import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SealinsComponent } from './sealins.component';

const routes: Routes = [
  {
    path: '',
     component: SealinsComponent,
    data: {
      title: 'Seal In'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SealInsRoutingModule { }