import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { CompositeType } from '../../editor/drawing/enums/composite-type.enum';
import { DecoratorType } from '../../editor/drawing/enums/decorator-type.enum';
import { NodeGroupType } from '../../editor/drawing/enums/node-group-type.enum';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { CanvasManagerService } from '../../editor/services/canvas-manager.service';
import { SPNode } from '../models/sp-node.model';

@Injectable()
export class ImportService {
  constructor(private manager: CanvasManagerService) {}

  import(root: SPNode) {
    this.manager.clear();
    const rootNode = this.manager.addRootNode(
      root.x,
      root.y,
      root.identifier,
      root.displayName
    );
    this.appendChildrenTo(root.children, rootNode);
  }

  private appendChildrenTo(children: SPNode[], parent: NodeGroup): void {
    forEach(children, (child) => {
      const childNode = this.createNodeFrom(child);
      this.manager.connect(parent, childNode);
      this.appendChildrenTo(child.children, childNode);
    });
  }

  private createNodeFrom(node: SPNode): NodeGroup {
    switch (node.type) {
      case NodeGroupType[NodeGroupType.Action]:
        return this.manager.addActionNode(
          node.x,
          node.y,
          node.displayName,
          node.identifier
        );
      case NodeGroupType[NodeGroupType.Composite]:
        return this.manager.addCompositeNode(
          node.x,
          node.y,
          CompositeType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Condition]:
        return this.manager.addConditionNode(
          node.x,
          node.y,
          node.displayName,
          node.identifier
        );
      case NodeGroupType[NodeGroupType.Decorator]:
        return this.manager.addDecorator(
          node.x,
          node.y,
          DecoratorType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Tree]:
        return this.manager.addTree(node.x, node.y, node.displayName);
      default:
        return {} as NodeGroup;
    }
  }
}
