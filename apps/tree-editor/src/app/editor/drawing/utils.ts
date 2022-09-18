import Two from 'two.js';
import { Shape } from 'two.js/src/shape';

export function getHitElement(two: Two, e: MouseEvent): Shape | undefined {
  const hitSizeFactor = 30;

  var mouse = new Two.Vector();
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  let result = two.scene.children.find((child: any) => {
    if (child.isShape) {
      let bounds = child.getBoundingClientRect();
      if (
        mouse.x > bounds.left + hitSizeFactor &&
        mouse.x < bounds.right - hitSizeFactor &&
        mouse.y > bounds.top + hitSizeFactor &&
        mouse.y < bounds.bottom - hitSizeFactor
      ) {
        return child;
      }
    }
  });
  return result;
}
