import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { filter, Subject, takeUntil } from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { Destroy } from '../../shared/components/destory';
import { NodeGroup } from '../drawing/node.group';
import { getHitElement } from '../drawing/utils';
import { CanvasService } from './canvas.service';
import { InputService } from './input.service';
import { NodeManagerService } from './node-manager.service';

@Injectable()
export class SelectionService extends Destroy {
  selectedSubject = new Subject<NodeGroup>();
  selected$ = this.selectedSubject.asObservable();

  constructor(
    private input: InputService,
    private manager: NodeManagerService,
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
        const hit = getHitElement(this.canvas.two, mouseDown);
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
        }
      });
  }

  deselectAll() {
    forEach(this.manager.nodes, (node) => node.deselect());
  }
}
