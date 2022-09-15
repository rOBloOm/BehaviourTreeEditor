import { Injectable } from '@angular/core';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { makeRect2 } from '../drawing/shapes';

@Injectable()
export class SandboxService {
  attach(two: Two, zui: ZUI): void {
    const x = two.width * 0.5;
    const y = two.height * 0.5;
    const width = 50;
    const height = 50;

    var rect1 = makeRect2(two, x, y, width, height, 10);
    rect1.on('mousedown', mouseDownR1);

    var rect2 = makeRect2(two, x + 100, y, width, height, 10);
    rect2.on('mousedown', mouseDownR2);

    two.makeGroup(rect1, rect2);

    function mouseDownR1(e) {
      console.log('r1');
    }

    function mouseDownR2(e) {
      console.log('r2');
    }

    two.makeCircle(100, 40, 10);
  }
}
