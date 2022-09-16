import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, takeUntil } from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { Shape } from 'two.js/src/shape';
import { Destroy } from '../../shared/components/destory';
import { CanvasService } from './canvas.service';
import { InputService } from './input.service';

@Injectable()
export class DragService extends Destroy {
  constructor(
    private inputService: InputService,
    private canvasService: CanvasService
  ) {
    super();
  }

  attach(two: Two, zui: ZUI): void {
    const draggingShape = new BehaviorSubject<Shape | undefined>(undefined);
    var mouse = new Two.Vector();

    //Detect if left click on a shape
    combineLatest([this.inputService.mouseDown$, this.canvasService.pannig$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([mouseDown, panning]) => !panning && mouseDown.button === 0)
      )
      .subscribe(([mouseDown]) => {
        var shape = this.getHitElement(two, mouseDown);
        if (shape) {
          mouse.x = mouseDown.clientX;
          mouse.y = mouseDown.clientY;
          draggingShape.next(shape);
        }
      });

    //Release the shape on mouseup
    this.inputService.mouseUp$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      draggingShape.next(undefined);
    });

    //Move the shape on mousemove if one is picked up
    combineLatest([this.inputService.mouseMove$, draggingShape])
      .pipe(
        takeUntil(this.destroy$),
        filter(([, shape]) => shape !== undefined)
      )
      .subscribe(([mouseMove, shape]) => {
        var dx = mouseMove.clientX - mouse.x;
        var dy = mouseMove.clientY - mouse.y;
        shape.position.x += dx / zui.scale;
        shape.position.y += dy / zui.scale;
        mouse.set(mouseMove.clientX, mouseMove.clientY);
      });
  }

  getHitElement(two: Two, e: MouseEvent): Shape | undefined {
    var mouse = new Two.Vector();
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    let result = two.scene.children.find((child: any) => {
      if (child.isShape) {
        let bounds = child.getBoundingClientRect();
        if (
          mouse.x > bounds.left &&
          mouse.x < bounds.right &&
          mouse.y > bounds.top &&
          mouse.y < bounds.bottom
        ) {
          return child;
        }
      }
    });
    return result;
  }
}
