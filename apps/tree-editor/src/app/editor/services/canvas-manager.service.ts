import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { Destroy } from '../../shared/components/destory';
import { NodeConnection } from '../drawing/models/node-connection.model';
import { NodeGroup } from '../drawing/models/node-group.model';
import { CanvasService } from './canvas.service';
import { DrawingService } from '../drawing/drawing.service';
import { SelectionService } from './selection.service';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CompositeType } from '../drawing/enums/composite-type.enum';

@Injectable()
export class CanvasManagerService extends Destroy {
  nodes: { [name: string]: NodeGroup } = {};

  private _root: NodeGroup;
  get root(): NodeGroup {
    return this._root;
  }

  constructor(private drawing: DrawingService, private canvas: CanvasService) {
    super();
  }

  clear() {
    this.canvas.two.clear();
  }

  addRootNode(x: number, y: number): NodeGroup {
    const node = this.drawing.createRootNode(x, y);
    this._root = node;
    this.nodes[node.id] = node;
    return node;
  }

  addCompositeNode(x: number, y: number, type: CompositeType): NodeGroup {
    const node = this.drawing.createCompositeNode(x, y, type);
    this.nodes[node.id] = node;
    return node;
  }

  addActionNode(
    x: number,
    y: number,
    text: string,
    customReference: string
  ): NodeGroup {
    const node = this.drawing.createActionNode(x, y, text, customReference);
    this.nodes[node.id] = node;
    return node;
  }

  addConditionNode(
    x: number,
    y: number,
    text: string,
    customReference: string
  ): NodeGroup {
    const node = this.drawing.createConditionNode(x, y, text, customReference);
    this.nodes[node.id] = node;
    return node;
  }

  addDecorator(x: number, y: number, type: DecoratorType): NodeGroup {
    const node = this.drawing.createDecoratorNode(x, y, type);
    this.nodes[node.id] = node;
    return node;
  }

  addTree(x: number, y: number, text: string): NodeGroup {
    const node = this.drawing.createTreeNode(x, y, text);
    this.nodes[node.id] = node;
    return node;
  }

  connect(source: NodeGroup, target: NodeGroup): NodeConnection | undefined {
    //Check if target accepts incoming type
    if (!target.acceptIncoming(source.nodeType)) return undefined;
    //Check if target is already connected
    if (target.connectionIn) {
      this.removeConnection(target.connectionIn);
    }
    //Check for multiple outgoing connections
    if (!source.acceptMultipleOutgoing()) {
      if (source.connectionsOut.length > 0) {
        this.removeConnection(source.connectionsOut[0]);
      }
    }

    //Check for a circular connection
    const circularConnection = target.connectionsOut.find(
      (c) => c.target === source
    );
    if (circularConnection) {
      this.removeConnection(circularConnection);
    }

    const arrow = this.drawing.createConnection(source, target);
    const connection = new NodeConnection(source, target, arrow);
    source.connectionsOut.push(connection);
    target.connectionIn = connection;
    return connection;
  }

  removeAllConnections(node: NodeGroup) {
    if (node.connectionIn) {
      this.removeConnection(node.connectionIn);
    }
    const tempConnectionsOut = Array.from(node.connectionsOut);
    forEach(tempConnectionsOut, (conn) => this.removeConnection(conn));
  }

  removeConnection(connection: NodeConnection): void {
    connection.shape.remove();
    connection.target.connectionIn = undefined;
    const removeIndex = connection.source.connectionsOut.findIndex(
      (conn) => conn.target.id === connection.target.id
    );
    connection.source.connectionsOut.splice(removeIndex, 1);
    connection = undefined;
  }

  removeNode(id: string) {
    const node = this.nodes[id];
    if (!node.canDelete()) return;
    if (node) {
      this.removeAllConnections(node);
      node.group.remove();
      delete this.nodes[id];
    }
  }

  canDelete(id: string) {
    const node = this.nodes[id];
    return node && node.canDelete();
  }
}
