import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sp-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {}
