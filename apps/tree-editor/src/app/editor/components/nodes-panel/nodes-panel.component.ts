import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { CanvasService } from '../../services/canvas.service';
import { DragService } from '../../services/drag.service';
import { SandboxService } from '../../services/sandbox.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'sp-nodes-panel',
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
    private selection: SelectionService
  ) {}

  ngAfterViewInit(): void {
    this.canvas.attach(this.domElement.nativeElement);
    this.drag.init();
    this.sandbox.init();
    this.selection.init();
  }
}
