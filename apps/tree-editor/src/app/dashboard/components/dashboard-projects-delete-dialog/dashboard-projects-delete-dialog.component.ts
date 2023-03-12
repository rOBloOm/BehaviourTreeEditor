import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sp-dashboard-projects-delete-dialog',
  templateUrl: './dashboard-projects-delete-dialog.component.html',
  styleUrls: ['./dashboard-projects-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsDeleteDialogComponent {
  @Input()
  name: string;

  constructor(public modal: NgbActiveModal) {}
}
