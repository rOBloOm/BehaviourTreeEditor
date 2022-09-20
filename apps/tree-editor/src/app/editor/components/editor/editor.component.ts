import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { InputService } from '../../services/input.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  constructor(private input: InputService) {}
}
