import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'sp-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlexModule],
})
export class DashboardHomeComponent {}
