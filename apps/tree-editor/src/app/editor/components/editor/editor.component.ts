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

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.input.keyDown(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.input.keyUp(event);
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    this.input.mouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.input.mouseMove(event);
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    this.input.mouseDown(event);
  }

  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent) {
    this.input.wheel(event);
  }
}
