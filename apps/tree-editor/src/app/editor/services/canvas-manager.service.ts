import { Injectable } from '@angular/core';
import { forEach, map, take } from 'lodash-es';
import { Destroy } from '../../shared/components/destory';
import { NodeConnection } from '../drawing/models/node-connection.model';
import { NodeGroup } from '../drawing/models/node-group.model';
import { CanvasService } from './canvas.service';
import { DrawingService } from '../drawing/drawing.service';
import { SelectionService } from './selection.service';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { NodeGroupType } from '../drawing/enums/node-group-type.enum';
import { ActionNodeGroup } from '../drawing/models/action-node-group.model';
import { CompositeNodeGroup } from '../drawing/models/composite-node-group.model';
import { ConditionNodeGroup } from '../drawing/models/condition-node-group.model';
import { DecoratorNodeGroup } from '../drawing/models/decorator-node-group.model';
import { TreeNodeGroup } from '../drawing/models/tree-node-group.model';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';

@Injectable()
export class CanvasManagerService extends Destroy {
  nodes: { [name: string]: NodeGroup } = {};

  private rootSubject = new BehaviorSubject<TreeNodeGroup | undefined>(
    undefined
  );
  root$ = this.rootSubject.asObservable();
  get currentRoot(): TreeNodeGroup {
    return this.rootSubject.value;
  }

  rootIdentifierSubject = new BehaviorSubject<string>('');
  rootIdentifier$ = this.rootIdentifierSubject.asObservable();

  constructor(private drawing: DrawingService, private canvas: CanvasService) {
    super();

    this.root$
      .pipe(
        takeUntil(this.destroy$),
        filter((root) => root !== undefined)
      )
      .subscribe((root) => this.updateCurrentTreeIdentifier(root.identifier));
  }

  updateCurrentTreeIdentifier(identifier: string) {
    this.rootSubject.value.identifier = identifier;
    this.rootIdentifierSubject.next(identifier);
  }

  clear() {
    this.canvas.two.clear();
    this.rootSubject.next(undefined);
  }

  addRootNode(x: number, y: number, identifier: string): NodeGroup {
    const node = this.drawing.createRootNode(x, y, identifier);
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
    text: string,
    identifier: string
  ): NodeGroup {
    const node = this.drawing.createActionNode(x, y, text, identifier);
    this.nodes[node.id] = node;
    return node;
  }

  addConditionNode(
    x: number,
    y: number,
    text: string,
    identifier: string
  ): NodeGroup {
    const node = this.drawing.createConditionNode(x, y, text, identifier);
    this.nodes[node.id] = node;
    return node;
  }

  addDecorator(x: number, y: number, type: DecoratorType): NodeGroup {
    const node = this.drawing.createDecoratorNode(x, y, type);
    this.nodes[node.id] = node;
    return node;
  }

  addTree(x: number, y: number, identifier: string): NodeGroup {
    const node = this.drawing.createTreeNode(x, y, identifier);
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

  //@TODO remove if not needed
  redraw(node: NodeGroup, text: string): NodeGroup {
    //Extract node attributes
    const x = node.x;
    const y = node.y;
    const nodeType = node.nodeType;
    const parent = node.connectionIn.source;
    const children = map(node.connectionsOut, (conn) => conn.target);

    // Create the new node
    let redrawnNode: NodeGroup;
    switch (nodeType) {
      case NodeGroupType.Action:
        redrawnNode = this.addActionNode(
          x,
          y,
          text,
          (node as ActionNodeGroup).identifier
        );
        break;
      case NodeGroupType.Composite:
        redrawnNode = this.addCompositeNode(
          x,
          y,
          (node as CompositeNodeGroup).compositeType
        );
        break;
      case NodeGroupType.Condition:
        redrawnNode = this.addConditionNode(
          x,
          y,
          text,
          (node as ConditionNodeGroup).identifier
        );
        break;
      case NodeGroupType.Decorator:
        redrawnNode = this.addDecorator(
          x,
          y,
          (node as DecoratorNodeGroup).decoratorType
        );
        break;
      case NodeGroupType.Tree:
        redrawnNode = this.addTree(x, y, text);
        break;
      default:
        throw new Error(
          'Redraw not supportet for Node Type: ' + NodeGroupType[node.nodeType]
        );
    }

    //Remove the old node
    this.removeNode(node.id);

    //Recreate the connections
    if (parent) {
      this.connect(parent, redrawnNode);
    }
    forEach(children, (child) => {
      this.connect(redrawnNode, child);
    });

    return redrawnNode;
  }
}
