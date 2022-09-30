import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { from, takeUntil } from 'rxjs';
import { Destroy } from '../../../utils/components/destory';

@Component({
  selector: 'sp-dashboard-projects-dialog',
  templateUrl: './dashboard-projects-dialog.component.html',
  styleUrls: ['./dashboard-projects-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsDialogComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
  });

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onAdd(): void {
    this.activeModal.close(this.form.value.name);
  }
}
