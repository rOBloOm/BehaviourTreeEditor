import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlexModule, RouterLink],
})
export class DashboardMenuComponent {}
