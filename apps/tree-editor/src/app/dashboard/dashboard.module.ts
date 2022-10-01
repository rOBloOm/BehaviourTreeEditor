import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardProjectsComponent } from './components/dashboard-projects/dashboard-projects.component';
import { DashboardSettingsComponent } from './components/dashboard-settings/dashboard-settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardProjectsDialogComponent } from './components/dashboard-projects-dialog/dashboard-projects-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardProjectsDeleteDialogComponent } from './components/dashboard-projects-delete-dialog/dashboard-projects-delete-dialog.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMenuComponent,
    DashboardHomeComponent,
    DashboardProjectsComponent,
    DashboardSettingsComponent,
    DashboardProjectsDialogComponent,
    DashboardProjectsDeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class DashboardModule {}
