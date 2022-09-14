import { createInjectableType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';

@Injectable()
export class CameraService {
  constructor() {}

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
