import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { CanvasService } from '../../services/canvas.service';
import { ConnectionService } from '../../services/connection.service';
import { DragService } from '../../services/drag.service';
import { InputService } from '../../services/input.service';
import { SandboxService } from '../../services/sandbox.service';
import { SelectionService } from '../../services/selection.service';
import { ShortcutService } from '../../services/shortcut.service';

@Component({
  selector: 'sp-editor-nodes-panel',
  templateUrl: './nodes-panel.component.html',
  styleUrls: ['./nodes-panel.component.scss'],
})
export class NodesPanelComponent implements AfterViewInit {
  @ViewChild('canvas') domElement: ElementRef;

  destorySubject = Subject;

  constructor(
    private canvas: CanvasService,
    private drag: DragService,
    private sandbox: SandboxService,
    private selection: SelectionService,
    private shortcut: ShortcutService,
    private connection: ConnectionService,
    private input: InputService
  ) {}

  ngAfterViewInit(): void {
    this.canvas.attach(this.domElement.nativeElement);
    this.drag.init();
    this.sandbox.init();
    this.selection.init();
    this.shortcut.init();
    this.connection.init();
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

  // @HostListener('window:keydown', ['$event'])
  // keyDown(event: KeyboardEvent) {
  //   this.input.keyDown(event);
  // }

  // @HostListener('window:keyup', ['$event'])
  // keyUp(event: KeyboardEvent) {
  //   this.input.keyUp(event);
  // }
}
