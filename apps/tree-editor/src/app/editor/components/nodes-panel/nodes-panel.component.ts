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
import { makeRect2 } from '../../drawing/shapes';
import { CameraService } from '../../services/camera.service';
import { DragService } from '../../services/drag.service';
import { SandboxService } from '../../services/sandbox.service';

@Component({
  selector: 'sp-nodes-panel',
  templateUrl: './nodes-panel.component.html',
  styleUrls: ['./nodes-panel.component.scss'],
})
export class NodesPanelComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  destorySubject = Subject;

  constructor(
    private camera: CameraService,
    private drag: DragService,
    private sandboxService: SandboxService
  ) {}

  ngAfterViewInit(): void {
    const two = new Two({
      type: Two.Types.canvas,
      fullscreen: true,
      overdraw: false,
      fitted: true,
      autostart: true,
    }).appendTo(this.canvas.nativeElement);

    const zui = new ZUI(two.scene);
    zui.addLimits(0.06, 8);

    this.camera.attach(two, zui);
    this.drag.attach(two, zui);
    this.sandboxService.attach(two, zui);
  }
}
