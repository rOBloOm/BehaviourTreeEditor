import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { Destroy } from '../../shared/components/destory';
import { NodeConnection } from '../drawing/node.connection';
import { NodeGroup } from '../drawing/node.group';
import { CanvasService } from './canvas.service';
import { DrawingService } from './drawing.service';

@Injectable()
export class CanvasManagerService extends Destroy {
  nodes: { [name: string]: NodeGroup } = {};

  constructor(private drawing: DrawingService, private canvas: CanvasService) {
    super();
  }

  clear() {
    this.canvas.two.clear();
  }

  getTree(): void {}

  applyTree(): void {
    this.clear();
  }

  addCompositeNode(x: number, y: number, text: string): void {
    const node = this.drawing.createCompositeNode(x, y, text);
    this.nodes[node.id] = node;
  }

  addActionNode(x: number, y: number, text: string): void {
    const node = this.drawing.createActionNode(x, y, text);
    this.nodes[node.id] = node;
  }

  connect(source: NodeGroup, target: NodeGroup) {
    //Check if target accepts incoming type
    if (!target.acceptIncoming(source.type)) return;
    //Check if target is already connected
    if (target.connectionIn) {
      this.removeConnection(target.connectionIn);
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
  }

  removeAllConnections(node: NodeGroup) {
    if (node.connectionIn) {
      this.removeConnection(node.connectionIn);
    }
    forEach(node.connectionsOut, (conn) => this.removeConnection(conn));
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
    if (node) {
      this.removeAllConnections(node);
      node.group.remove();
      delete this.nodes[id];
    }
  }
}
