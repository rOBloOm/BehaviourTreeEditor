import { Injectable } from '@angular/core';
import Two from 'two.js';
import { Path } from 'two.js/src/path';

@Injectable()
export class DragService {
  attach(two: Two): void {
    two.renderer.domElement.addEventListener('mousedown', mousedown, false);
    var mouse = new Two.Vector();

    function mousedown(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      two.scene.children.forEach((child: any) => {
        if (child.isShape) {
          let bounds = child.getBoundingClientRect();
          if (
            mouse.x > bounds.left &&
            mouse.x < bounds.right &&
            mouse.y > bounds.top &&
            mouse.y < bounds.bottom
          ) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            child.fill = '#' + randomColor;
          }
        }
      });
    }
  }
}
