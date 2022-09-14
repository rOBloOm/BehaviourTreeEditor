import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { InputService } from '../../services/input.service';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  constructor(private inputService: InputService) {}

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.inputService.keyDown(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.inputService.keyUp(event);
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    this.inputService.mouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.inputService.mouseMove(event);
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    this.inputService.mouseDown(event);
  }
}
