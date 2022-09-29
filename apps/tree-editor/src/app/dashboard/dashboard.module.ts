import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardProjectsComponent } from './components/dashboard-projects/dashboard-projects.component';
import { DashboardSettingsComponent } from './components/dashboard-settings/dashboard-settings.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMenuComponent,
    DashboardHomeComponent,
    DashboardProjectsComponent,
    DashboardSettingsComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
