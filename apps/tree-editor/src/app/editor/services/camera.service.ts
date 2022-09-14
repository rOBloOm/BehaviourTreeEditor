import { Injectable } from '@angular/core';
import {
  combineLatest,
  filter,
  map,
  skip,
  skipUntil,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { Destroy } from '../../shared/components/destory';
import { InputService } from './input.service';

@Injectable()
export class CameraService extends Destroy {
  constructor(private inputService: InputService) {
    super();
  }

  attach(two: Two): void {
    const zui = new ZUI(two.scene);
    zui.addLimits(0.06, 8);

    this.attachZoomBehavior(two, zui);
    this.attachPanBehaviour(two, zui);
  }

  private attachZoomBehavior(two: Two, zui: ZUI): void {
    two.renderer.domElement.addEventListener('mousewheel', mousewheel, false);

    function mousewheel(e) {
      e.stopPropagation();
      e.preventDefault();

      var dy = (e.wheelDeltaY || -e.deltaY) / 1000;

      zui.zoomBy(dy, e.clientX, e.clientY);
    }
  }

  private attachPanBehaviour(two: Two, zui: ZUI): void {
    let panning = false;
    var mouse = new Two.Vector();

    this.inputService.mouseDown$
      .pipe(
        filter((event) => event.shiftKey && event.button === 0),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        panning = true;
      });

    this.inputService.mouseUp$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (panning) {
        panning = false;
      }
    });

    this.inputService.mouseMove$
      .pipe(
        filter((_) => panning),
        takeUntil(this.destroy$)
      )
      .subscribe((mouseMove) => {
        var dx = mouseMove.clientX - mouse.x;
        var dy = mouseMove.clientY - mouse.y;
        zui.translateSurface(dx, dy);
        mouse.set(mouseMove.clientX, mouseMove.clientY);
      });
  }

  private attachOldPanBehaviour(two: Two, zui: ZUI): void {
    two.renderer.domElement.addEventListener('mousedown', mousedown, false);
    var mouse = new Two.Vector();

    function mousedown(e) {
      if (e.button === 1) {
        //Canvas Drag with middle mouse button
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        window.addEventListener('mousemove', mousemove, false);
        window.addEventListener('mouseup', mouseup, false);
      }
    }

    function mouseup(e) {
      window.removeEventListener('mousemove', mousemove, false);
      window.removeEventListener('mouseup', mouseup, false);
    }

    function mousemove(e) {
      var dx = e.clientX - mouse.x;
      var dy = e.clientY - mouse.y;
      zui.translateSurface(dx, dy);
      mouse.set(e.clientX, e.clientY);
    }
  }
}
