import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LeafNodeImportService } from '../../services/leaf-node-import.service';

@Component({
  selector: 'sp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LeafNodeImportService],
})
export class DashboardComponent {}
