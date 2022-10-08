import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sweet-potato-delete-tree-dialog',
  templateUrl: './delete-tree-dialog.component.html',
  styleUrls: ['./delete-tree-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTreeDialogComponent implements OnInit {
  @Input()
  name: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
}
