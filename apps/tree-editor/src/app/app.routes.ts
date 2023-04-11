import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'editor',
    loadChildren: () =>
      import('./editor/editor.routes').then((m) => m.EDITOR_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
