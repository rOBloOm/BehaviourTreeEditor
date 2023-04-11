import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { CanvasService } from './canvas.service';
import { CanvasMouseService } from './canvas-mouse.service';
import { CanvasManagerService } from './canvas-manager.service';
import { getHitNodeGroup } from '../drawing.utils';
import { NodeGroup } from '../models/node-group.model';
import { Destroy } from '@sweet-potato/core';

@Injectable()
export class CanvasSelectionService extends Destroy {
  private selectedSubject = new BehaviorSubject<NodeGroup>(undefined);
  selected$ = this.selectedSubject.asObservable();

  private doubleClickedSubject = new BehaviorSubject<NodeGroup>(undefined);
  doubleClicked$ = this.doubleClickedSubject.asObservable();

  get currentSelected(): NodeGroup {
    return this.selectedSubject.value;
  }

  constructor(
    private mouse: CanvasMouseService,
    private manager: CanvasManagerService,
    private canvas: CanvasService
  ) {
    super();
  }

  init(): void {
    this.registerClicks();
    this.registerDoubleClicks();
  }

  registerClicks(): void {
    //Select items on the canvas
    this.mouse.mouseDown$
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

  registerDoubleClicks(): void {
    //Doubleclick items on the canvas
    this.mouse.doubleClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const hit = getHitNodeGroup(this.canvas.two, event, this.manager.nodes);
        if (hit) {
          const hitNode = this.manager.nodes[hit.id];
          if (hitNode) {
            this.doubleClickedSubject.next(hitNode);
          }
        }
      });
  }

  deselectAll() {
    forEach(this.manager.nodes, (node) => node.deselect());
    this.selectedSubject.next(undefined);
  }
}
