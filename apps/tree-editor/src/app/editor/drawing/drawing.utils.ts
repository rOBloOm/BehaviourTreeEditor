import Two from 'two.js';
import { Shape } from 'two.js/src/shape';
import { NodeGroup } from './models/node-group.model';

export function getHitNodeGroup(
  two: Two,
  e: MouseEvent,
  nodes: { [name: string]: NodeGroup },
  exclude: NodeGroup[] = []
): Shape | undefined {
  var mouse = new Two.Vector();
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  let result = two.scene.children.find((child: any) => {
    if (nodes[child.id] && exclude.every((node) => node.id != child.id)) {
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
