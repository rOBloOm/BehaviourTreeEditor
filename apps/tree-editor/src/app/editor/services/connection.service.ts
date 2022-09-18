import { Injectable } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { Destroy } from '../../shared/components/destory';
import { getHitElement } from '../drawing/utils';
import { CanvasService } from './canvas.service';
import { InputService } from './input.service';

@Injectable()
export class ConnectionService extends Destroy {
  constructor(private canvas: CanvasService, private input: InputService) {
    super();
  }

  init() {
    this.input.mouseDown$
      .pipe(
        takeUntil(this.destroy$),
        filter((mouseDown) => mouseDown.button === 0 && mouseDown.ctrlKey)
      )
      .subscribe((mouseDown) => {
        const hit = getHitElement(this.canvas.two, mouseDown);
      });

    this.input.mouseMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mouseMove) => {});

    this.input.mouseUp$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mouseUp) => {});
  }
}
