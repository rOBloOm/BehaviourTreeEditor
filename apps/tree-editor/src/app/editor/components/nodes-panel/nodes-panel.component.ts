import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CanvasConnectionService } from '../../drawing/systems/canvas-connection.service';
import { CanvasDragService } from '../../drawing/systems/canvas-drag.service';
import { CanvasDropService } from '../../drawing/systems/canvas-drop.service';
import { CanvasMouseService } from '../../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { CanvasService } from '../../drawing/systems/canvas.service';

@Component({
  selector: 'sp-editor-nodes-panel',
  templateUrl: './nodes-panel.component.html',
  styleUrls: ['./nodes-panel.component.scss'],
  standalone: true,
})
export class NodesPanelComponent implements AfterViewInit {
  @ViewChild('canvas') domElement: ElementRef;

  destorySubject = Subject;

  constructor(
    private canvas: CanvasService,
    private canvasDrag: CanvasDragService,
    private canvasDrop: CanvasDropService,
    private canvasSelection: CanvasSelectionService,
    private canvasConnection: CanvasConnectionService,
    private canvasMouse: CanvasMouseService
  ) {}

  ngAfterViewInit(): void {
    this.canvas.attach(this.domElement.nativeElement);
    this.canvasDrag.init();
    this.canvasDrop.init();
    this.canvasSelection.init();
    this.canvasConnection.init();
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    this.canvasMouse.mouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.canvasMouse.mouseMove(event);
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    this.canvasMouse.mouseDown(event);
  }

  @HostListener('dblclick', ['$event'])
  doubleClick(event: MouseEvent) {
    this.canvasMouse.doubleClick(event);
  }

  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent) {
    this.canvasMouse.wheel(event);
  }

  @HostListener('mouseenter', ['$event'])
  enter() {
    this.canvasMouse.mouseEnter();
  }

  @HostListener('mouseleave', ['$event'])
  leave() {
    this.canvasMouse.mouseLeave();
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    this.canvasMouse.dragOver(event);
  }

  @HostListener('dragenter', ['$event'])
  dragEnter() {
    this.canvasMouse.mouseEnter();
  }

  @HostListener('dragleave', ['$event'])
  dragLeave() {
    this.canvasMouse.mouseLeave();
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    this.canvasMouse.drop(event);
  }
}
