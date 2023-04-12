import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./components/dashboard-home/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import(
            './components/dashboard-projects/dashboard-projects.component'
          ).then((m) => m.DashboardProjectsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './components/dashboard-settings/dashboard-settings.component'
          ).then((m) => m.DashboardSettingsComponent),
      },
    ],
  },
];
