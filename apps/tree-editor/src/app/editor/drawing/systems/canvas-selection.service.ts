import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { CanvasService } from './canvas.service';
import { CanvasMouseService } from './canvas-mouse.service';
import { CanvasManagerService } from './canvas-manager.service';
import { Destroy } from '../../../utils/components/destory';
import { getHitNodeGroup } from '../drawing.utils';
import { NodeGroup } from '../models/node-group.model';

@Injectable()
export class CanvasSelectionService extends Destroy {
  selectedSubject = new BehaviorSubject<NodeGroup>(undefined);
  selected$ = this.selectedSubject.asObservable();

  get currentSelected(): NodeGroup {
    return this.selectedSubject.value;
  }

  constructor(
    private input: CanvasMouseService,
    private manager: CanvasManagerService,
    private canvas: CanvasService
  ) {
    super();
  }

  init(): void {
    //Select items on the canvas
    this.input.mouseDown$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (mouseDown) =>
            mouseDown.button === 0 && !mouseDown.shiftKey && !mouseDown.ctrlKey
        )
      )
      .subscribe((mouseDown) => {
        const hit = getHitNodeGroup(
          this.canvas.two,
          mouseDown,
          this.manager.nodes
        );
        if (hit) {
          this.deselectAll();
          //Select hit node
          const hitNode = this.manager.nodes[hit.id];
          if (hitNode) {
            hitNode.select();
            this.selectedSubject.next(hitNode);
          }
        } else {
          //if nothing was hit, deselect everything
          this.deselectAll();
          this.selectedSubject.next(undefined);
        }
      });
  }

  deselectAll() {
    forEach(this.manager.nodes, (node) => node.deselect());
    this.selectedSubject.next(undefined);
  }
}
