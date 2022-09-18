import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, takeUntil } from 'rxjs';
import Two from 'two.js';
import { Shape } from 'two.js/src/shape';
import { Destroy } from '../../shared/components/destory';
import { getHitElement } from '../drawing/utils';
import { CanvasService } from './canvas.service';
import { InputService } from './input.service';

@Injectable()
export class DragService extends Destroy {
  constructor(private input: InputService, private canvas: CanvasService) {
    super();
  }

  init(): void {
    const draggingShape = new BehaviorSubject<Shape | undefined>(undefined);
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
        var shape = getHitElement(this.canvas.two, mouseDown);
        if (shape) {
          mouse.x = mouseDown.clientX;
          mouse.y = mouseDown.clientY;
          draggingShape.next(shape);
        }
      });

    //Release the shape on mouseup
    this.input.mouseUp$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      draggingShape.next(undefined);
    });

    //Move the shape on mousemove if one is picked up
    combineLatest([this.input.mouseMove$, draggingShape])
      .pipe(
        takeUntil(this.destroy$),
        filter(([, shape]) => shape !== undefined)
      )
      .subscribe(([mouseMove, shape]) => {
        var dx = mouseMove.clientX - mouse.x;
        var dy = mouseMove.clientY - mouse.y;
        shape.position.x += dx / this.canvas.zui.scale;
        shape.position.y += dy / this.canvas.zui.scale;
        mouse.set(mouseMove.clientX, mouseMove.clientY);
      });
  }
}
