import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sweet-potato-dashboard-projects-delete-dialog',
  templateUrl: './dashboard-projects-delete-dialog.component.html',
  styleUrls: ['./dashboard-projects-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsDeleteDialogComponent implements OnInit {
  @Input()
  name: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
}
