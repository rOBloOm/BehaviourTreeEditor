import { forEach } from 'lodash-es';
import { NodeGroupType } from '../../editor/drawing/enums/node-group-type.enum';
import { ICustomReference } from '../../editor/drawing/interfaces/custom-reference.interface';
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
      name: canvasNode.name,
      type: NodeGroupType[canvasNode.nodeType],
      customReference: this.getCustomReference(canvasNode),
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

  private static getCustomReference(canvasNode: NodeGroup): string {
    return this.hasCustomReference(canvasNode)
      ? canvasNode.customReference
      : '';
  }

  private static hasCustomReference(
    canvasNode: any
  ): canvasNode is ICustomReference {
    return canvasNode;
  }
}
