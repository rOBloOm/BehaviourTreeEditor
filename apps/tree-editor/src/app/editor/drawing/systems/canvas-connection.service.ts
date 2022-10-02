import { Injectable } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { Path } from 'two.js/src/path';
import { NodeGroup } from '../models/node-group.model';
import { EditorSettings } from '../drawing.settings';
import { getHitNodeGroup } from '../drawing.utils';
import { CanvasService } from './canvas.service';
import { CanvasMouseService } from './canvas-mouse.service';
import { CanvasManagerService } from './canvas-manager.service';
import Two from 'two.js';
import { Destroy } from '../../../utils/components/destory';

@Injectable()
export class CanvasConnectionService extends Destroy {
  constructor(
    private canvas: CanvasService,
    private canvasManager: CanvasManagerService,
    private canvasMouse: CanvasMouseService
  ) {
    super();
  }

  init() {
    let source: NodeGroup;
    let connecting = false;
    let arrow: Path;

    this.canvasMouse.mouseDown$
      .pipe(
        takeUntil(this.destroy$),
        filter((mouseDown) => mouseDown.button === 0 && mouseDown.ctrlKey)
      )
      .subscribe((mouseDown) => {
        const hit = getHitNodeGroup(
          this.canvas.two,
          mouseDown,
          this.canvasManager.nodes
        );
        if (hit) {
          source = this.canvasManager.nodes[hit.id];
          if (source.acceptOutgoing()) {
            connecting = true;
          }
        }
      });

    this.canvasMouse.mouseMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mouseMove) => {
        if (source && connecting) {
          if (arrow) {
            arrow.remove();
          }
          const sx = source.group.position.x + source.anchorOut.position.x;
          const sy = source.group.position.y + source.anchorOut.position.y;
          const pos = this.canvas.zui.clientToSurface(mouseMove.x, mouseMove.y);

          const direction = new Two.Vector(pos.x - sx, pos.y - sy).normalize();
          arrow = this.canvas.two.makeArrow(
            sx + direction.x * EditorSettings.connectionMargin,
            sy + direction.y * EditorSettings.connectionMargin,
            pos.x - direction.x * EditorSettings.connectionMargin,
            pos.y - direction.y * EditorSettings.connectionMargin,
            EditorSettings.connectionArrowSize
          );
          arrow.stroke = EditorSettings.connectionLineColor;
          arrow.linewidth = EditorSettings.connectionArrowLineWidth;
        }
      });

    this.canvasMouse.mouseUp$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => connecting)
      )
      .subscribe((mouseUp) => {
        connecting = false;
        if (arrow) {
          arrow.remove();
          arrow = undefined;
        }
        const hit = getHitNodeGroup(
          this.canvas.two,
          mouseUp,
          this.canvasManager.nodes,
          [source]
        );
        if (hit) {
          this.canvasManager.connect(source, this.canvasManager.nodes[hit.id]);
        }
      });
  }
}
