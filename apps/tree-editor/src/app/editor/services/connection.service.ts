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
import { NodeManagerService } from './node-manager.service';

@Injectable()
export class ConnectionService extends Destroy {
  constructor(
    private canvas: CanvasService,
    private input: InputService,
    private manager: NodeManagerService
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
          connecting = true;
        }
      });

    this.input.mouseMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mouseMove) => {
        if (source && connecting) {
          if (arrow) {
            arrow.remove();
          }
          const pos = this.canvas.zui.clientToSurface(mouseMove.x, mouseMove.y);
          arrow = this.canvas.two.makeArrow(
            source.group.position.x + source.shape.position.x,
            source.group.position.y + source.shape.position.y,
            pos.x,
            pos.y,
            EditorSettings.connectionArrowSize
          );
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
