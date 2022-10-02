import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CommandService } from '../../services/command.service';
import { CanvasConnectionService } from '../../drawing/systems/canvas-connection.service';
import { LoaderService } from '../../services/loader.service';
import { CanvasDragService } from '../../drawing/systems/canvas-drag.service';
import { CanvasMouseService } from '../../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { CanvasService } from '../../drawing/systems/canvas.service';
import { CanvasDropService } from '../../drawing/systems/canvas-drop.service';

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
    private canvasDrag: CanvasDragService,
    private canvasDrop: CanvasDropService,
    private canvasSelection: CanvasSelectionService,
    private canvasConnection: CanvasConnectionService,
    private canvasMouse: CanvasMouseService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas.attach(this.domElement.nativeElement);
    this.canvasDrag.init();
    this.canvasDrop.init();
    this.loader.init();
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

  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent) {
    this.canvasMouse.wheel(event);
  }

  @HostListener('mouseenter', ['$event'])
  enter(event: MouseEvent) {
    this.canvasMouse.mouseEnter(event);
  }

  @HostListener('mouseleave', ['$event'])
  leave(event: MouseEvent) {
    this.canvasMouse.mouseLeave(event);
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    this.canvasMouse.dragOver(event);
  }

  @HostListener('dragenter', ['$event'])
  dragEnter(event: DragEvent) {
    this.canvasMouse.mouseEnter(event);
  }

  @HostListener('dragleave', ['$event'])
  dragLeave(event: DragEvent) {
    this.canvasMouse.mouseLeave(event);
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    this.canvasMouse.drop(event);
  }
}
