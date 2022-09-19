import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { BehaviorSubject, combineLatest, filter, takeUntil } from 'rxjs';
import Two from 'two.js';
import { Shape } from 'two.js/src/shape';
import { Destroy } from '../../shared/components/destory';
import { NodeGroup } from '../drawing/node.group';
import { getHitNodeGroup } from '../drawing/utils';
import { CanvasService } from './canvas.service';
import { DrawingService } from './drawing.service';
import { InputService } from './input.service';
import { NodeManagerService } from './node-manager.service';

@Injectable()
export class DragService extends Destroy {
  constructor(
    private input: InputService,
    private canvas: CanvasService,
    private manager: NodeManagerService,
    private drawing: DrawingService
  ) {
    super();
  }

  init(): void {
    const draggingNodeGroup = new BehaviorSubject<Shape | undefined>(undefined);
    var mouse = new Two.Vector();

    //Detect if left click on a shape
    combineLatest([this.input.mouseDown$, this.canvas.pannig$])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([mouseDown, panning]) =>
            !panning && mouseDown.button === 0 && !mouseDown.ctrlKey
        )
      )
      .subscribe(([mouseDown]) => {
        var shape = getHitNodeGroup(
          this.canvas.two,
          mouseDown,
          this.manager.nodes
        );
        if (shape) {
          mouse.x = mouseDown.clientX;
          mouse.y = mouseDown.clientY;
          draggingNodeGroup.next(shape);
        }
      });

    //Release the shape on mouseup
    this.input.mouseUp$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      draggingNodeGroup.next(undefined);
    });

    //Move the shape on mousemove if one is picked up
    combineLatest([this.input.mouseMove$, draggingNodeGroup])
      .pipe(
        takeUntil(this.destroy$),
        filter(([, nodeGroup]) => nodeGroup !== undefined)
      )
      .subscribe(([mouseMove, nodeGroup]) => {
        var dx = mouseMove.clientX - mouse.x;
        var dy = mouseMove.clientY - mouse.y;
        nodeGroup.position.x += dx / this.canvas.zui.scale;
        nodeGroup.position.y += dy / this.canvas.zui.scale;
        mouse.set(mouseMove.clientX, mouseMove.clientY);
        this.updateConnections(nodeGroup);
      });
  }

  updateConnections(nodeGroup: Shape) {
    const node = this.manager.nodes[nodeGroup.id];
    if (!node) return;

    if (node.connectionIn) {
      node.connectionIn.shape.remove();
      const arrowIn = this.drawing.createConnection(
        node.connectionIn.source,
        node
      );
      node.connectionIn.shape = arrowIn;
    }
    forEach(node.connectionsOut, (conn) => {
      conn.shape.remove();
      const arrowOut = this.drawing.createConnection(conn.source, conn.target);
      conn.shape = arrowOut;
    });
  }
}
