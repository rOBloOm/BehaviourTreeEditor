import { forEach } from 'lodash-es';
import { NodeGroupType } from '../../editor/drawing/enums/node-group-type.enum';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { SPNode } from '../models/sp-node.model';

export class DataExport {
  public static convert(root: NodeGroup): SPNode {
    return this.convertNode(root);
  }

  private static convertNode(canvasNode: NodeGroup): SPNode {
    const node = {
      x: canvasNode.x,
      y: canvasNode.y,
      identifier: canvasNode.identifier,
      displayName: canvasNode.displayName,
      type: NodeGroupType[canvasNode.nodeType],
      children: [],
    } as SPNode;

    forEach(
      canvasNode.connectionsOut.sort((l, r) => l.target.x - r.target.x),
      (conn) => {
        const child = this.convertNode(conn.target);
        node.children.push(child);
      }
    );

    return node;
  }
}
