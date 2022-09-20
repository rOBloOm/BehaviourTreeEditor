import { Injectable } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { ZUI } from 'two.js/extras/jsm/zui';
import { Path } from 'two.js/src/path';
import { Destroy } from '../../shared/components/destory';
import { NodeGroup } from '../drawing/node.group';
import { EditorSettings } from '../drawing/settings';
import { getHitNodeGroup } from '../drawing/utils';
import { CanvasService } from './canvas.service';
import { InputService } from './input.service';
import { CanvasManagerService } from './canvas-manager.service';
import Two from 'two.js';

@Injectable()
export class ConnectionService extends Destroy {
  constructor(
    private canvas: CanvasService,
    private input: InputService,
    private manager: CanvasManagerService
  ) {
    super();
  }

  init() {
    let source: NodeGroup;
    let connecting = false;
    let arrow: Path;

    this.input.mouseDown$
      .pipe(
        takeUntil(this.destroy$),
        filter((mouseDown) => mouseDown.button === 0 && mouseDown.ctrlKey)
      )
      .subscribe((mouseDown) => {
        const hit = getHitNodeGroup(
          this.canvas.two,
          mouseDown,
          this.manager.nodes
        );
        if (hit) {
          source = this.manager.nodes[hit.id];
          if (source.acceptOutgoing()) {
            connecting = true;
          }
        }
      });

    this.input.mouseMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mouseMove) => {
        if (source && connecting) {
          if (arrow) {
            arrow.remove();
          }
          const sx = source.group.position.x + source.outAnchor.position.x;
          const sy = source.group.position.y + source.outAnchor.position.y;
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

    this.input.mouseUp$
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
          this.manager.nodes,
          [source]
        );
        if (hit) {
          this.manager.connect(source, this.manager.nodes[hit.id]);
        }
      });
  }
}
