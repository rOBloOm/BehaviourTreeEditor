import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafNodeImportService } from '../../services/leaf-node-import.service';
import { DashboardMenuComponent } from '../dashboard-menu/dashboard-menu.component';

@Component({
  selector: 'sp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [DashboardMenuComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LeafNodeImportService],
})
export class DashboardComponent {}
