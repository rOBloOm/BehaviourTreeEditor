import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sp-delete-tree-dialog',
  templateUrl: './delete-tree-dialog.component.html',
  styleUrls: ['./delete-tree-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTreeDialogComponent {
  @Input()
  name: string;

  constructor(public modal: NgbActiveModal) {}
}
