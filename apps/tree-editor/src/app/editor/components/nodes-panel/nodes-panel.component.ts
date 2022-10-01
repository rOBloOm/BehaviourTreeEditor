import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CanvasService } from '../../services/canvas.service';
import { CommandService } from '../../services/command.service';
import { ConnectionService } from '../../services/connection.service';
import { DragService } from '../../services/drag.service';
import { MouseInputService } from '../../services/mouse-input.service';
import { LoaderService } from '../../services/loader.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'sp-editor-nodes-panel',
  templateUrl: './nodes-panel.component.html',
  styleUrls: ['./nodes-panel.component.scss'],
  providers: [],
})
export class NodesPanelComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') domElement: ElementRef;

  destorySubject = Subject;

  constructor(
    private canvas: CanvasService,
    private drag: DragService,
    private loader: LoaderService,
    private selection: SelectionService,
    private connection: ConnectionService,
    private mouse: MouseInputService,
    private command: CommandService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas.attach(this.domElement.nativeElement);
    this.drag.init();
    this.loader.init();
    this.selection.init();
    this.connection.init();
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    this.mouse.mouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.mouse.mouseMove(event);
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    this.mouse.mouseDown(event);
  }

  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent) {
    this.mouse.wheel(event);
  }

  @HostListener('mouseenter', ['$event'])
  enter(event: MouseEvent) {
    this.mouse.mouseEnter(event);
  }

  @HostListener('mouseleave', ['$event'])
  leave(event: MouseEvent) {
    this.mouse.mouseLeave(event);
  }
}
