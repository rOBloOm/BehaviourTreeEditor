import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sp-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMenuComponent {}
