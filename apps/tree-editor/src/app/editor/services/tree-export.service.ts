import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { SPNode } from '../../data/models/sp-node.model';
import { NodeGroupType } from '../drawing/enums/node-group-type.enum';
import { NodeGroup } from '../drawing/models/node-group.model';

@Injectable()
export class TreeExportSerive {
  public export(root: NodeGroup): SPNode {
    return this.convertNode(root);
  }

  private convertNode(canvasNode: NodeGroup): SPNode {
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