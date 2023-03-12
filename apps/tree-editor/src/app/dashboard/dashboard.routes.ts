import { Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardProjectsComponent } from './components/dashboard-projects/dashboard-projects.component';
import { DashboardSettingsComponent } from './components/dashboard-settings/dashboard-settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: DashboardHomeComponent,
      },
      {
        path: 'projects',
        component: DashboardProjectsComponent,
      },
      {
        path: 'settings',
        component: DashboardSettingsComponent,
      },
    ],
  },
];
