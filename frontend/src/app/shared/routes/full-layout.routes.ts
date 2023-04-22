import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'page',
    loadChildren: () => import('../../page/page.module').then(m => m.PageModule)
  },
  {
    path: 'seals',
    loadChildren: () => import('../../seals/seals.module').then(m => m.SealsModule)
  },
  {
    path: 'trucks',
    loadChildren: () => import('../../trucks/truck.module').then(m => m.TruckModule)
  },
  {
    path: 'users',
    loadChildren: () => import('../../users/user.module').then(m => m.UserModule)
  },
   {
    path: 'forms',
    loadChildren: () => import('../../forms/forms.module').then(m => m.FormModule)
  },
];
