import { Injectable } from '@angular/core';
import Two from 'two.js';

@Injectable()
export class DragService {
  shiftPresed = false;

  attach(two: Two): void {
    two.renderer.domElement.addEventListener('mousedown', mousedown, false);
    two.renderer.domElement.addEventListener('keydown', keydown, false);
    two.renderer.domElement.addEventListener('keyup', keyup, false);

    var mouse = new Two.Vector();

    function keydown(e) {
      console.log(e);
    }

    function keyup(e) {
      console.log(e);
    }

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
