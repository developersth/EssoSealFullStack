import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SealinComponent } from './sealin/sealin.component';
import { SealoutComponent } from './sealout/sealout.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sealin',
        component: SealinComponent,
        data: {
          title: 'Seal In'
        }
      },
      {
        path: 'sealout',
        component: SealoutComponent,
        data: {
          title: 'Seal Out'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SealsRouteModule { }
