import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { Destroy } from '../../../base/components/destory';
import { CompositeType } from '../enums/composite-type.enum';
import { DecoratorType } from '../enums/decorator-type.enum';
import { NodeConnection } from '../models/node-connection.model';
import { NodeGroup } from '../models/node-group.model';
import { RootNodeGroup } from '../models/root-node-group.model';
import { TreeNodeGroup } from '../models/tree-node-group.model';
import { CanvasDrawingService } from './canvas-drawing.service';
import { CanvasService } from './canvas.service';

@Injectable()
export class CanvasManagerService extends Destroy {
  nodes: { [name: string]: NodeGroup } = {};

  private rootSubject = new BehaviorSubject<RootNodeGroup | undefined>(
    undefined
  );
  root$ = this.rootSubject.asObservable();
  get currentRoot(): TreeNodeGroup {
    return this.rootSubject.value;
  }

  rootDisplayNameSubject = new BehaviorSubject<string>('');
  rootDisplayName$ = this.rootDisplayNameSubject.asObservable();

  constructor(
    private drawing: CanvasDrawingService,
    private canvas: CanvasService
  ) {
    super();

    this.root$
      .pipe(
        takeUntil(this.destroy$),
        filter((root) => root !== undefined)
      )
      .subscribe((root) => this.updateCurrentTreeDisplayName(root.displayName));
  }

  updateCurrentTreeDisplayName(displayName: string) {
    this.rootSubject.value.displayName = displayName;
    this.rootDisplayNameSubject.next(displayName);
  }

  clear() {
    this.canvas.two.clear();
    this.rootSubject.next(undefined);
  }

  initNewTree(): NodeGroup {
    this.clear();
    const x = this.canvas.two.width * 0.5;
    const y = this.canvas.two.height * 0.2;
    return this.addRootNode(x, y, '', 'NewTree');
  }

  addRootNode(
    x: number,
    y: number,
    identifier: string,
    displayName: string
  ): NodeGroup {
    const node = this.drawing.createRootNode(x, y, identifier, displayName);
    this.nodes[node.id] = node;
    this.rootSubject.next(node);
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
    identifier: string,
    text: string,
    parameters: string[] = []
  ): NodeGroup {
    const node = this.drawing.createActionNode(x, y, identifier, text);
    node.parameters = parameters;
    this.nodes[node.id] = node;
    return node;
  }

  addConditionNode(
    x: number,
    y: number,
    identifier: string,
    text: string,
    parameters: string[] = []
  ): NodeGroup {
    const node = this.drawing.createConditionNode(x, y, identifier, text);
    node.parameters = parameters;
    this.nodes[node.id] = node;
    return node;
  }

  addDecorator(x: number, y: number, type: DecoratorType): NodeGroup {
    const node = this.drawing.createDecoratorNode(x, y, type);
    this.nodes[node.id] = node;
    return node;
  }

  addTree(x: number, y: number, identifier: string, name: string): NodeGroup {
    const node = this.drawing.createTreeNode(x, y, identifier, name);
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
