import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sp-dashboard-projects-dialog',
  templateUrl: './dashboard-projects-dialog.component.html',
  styleUrls: ['./dashboard-projects-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsDialogComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  isEdit: false;

  form = new FormGroup({
    name: new FormControl(''),
  });

  get title(): string {
    return this.isEdit ? 'Change project name' : 'Add project';
  }

  get confirmButtonText(): string {
    return this.isEdit ? 'save' : 'add';
  }

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.form.controls.name.setValue(this.name);
  }

  onAdd(): void {
    this.activeModal.close(this.form.value.name);
  }
}
