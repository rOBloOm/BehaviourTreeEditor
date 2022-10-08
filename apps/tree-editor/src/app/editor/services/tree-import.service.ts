import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { SPNode } from '../../data/models/sp-node.model';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { NodeGroupType } from '../drawing/enums/node-group-type.enum';
import { NodeGroup } from '../drawing/models/node-group.model';
import { CanvasManagerService } from '../drawing/systems/canvas-manager.service';

@Injectable()
export class TreeImportService {
  constructor(private canvasManager: CanvasManagerService) {}

  import(root: SPNode) {
    this.canvasManager.clear();
    const rootNode = this.canvasManager.addRootNode(
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
      this.canvasManager.connect(parent, childNode);
      this.appendChildrenTo(child.children, childNode);
    });
  }

  private createNodeFrom(node: SPNode): NodeGroup {
    switch (node.type) {
      case NodeGroupType[NodeGroupType.Action]:
        return this.canvasManager.addActionNode(
          node.x,
          node.y,
          node.identifier,
          node.displayName
        );
      case NodeGroupType[NodeGroupType.Composite]:
        return this.canvasManager.addCompositeNode(
          node.x,
          node.y,
          CompositeType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Condition]:
        return this.canvasManager.addConditionNode(
          node.x,
          node.y,
          node.identifier,
          node.displayName
        );
      case NodeGroupType[NodeGroupType.Decorator]:
        return this.canvasManager.addDecorator(
          node.x,
          node.y,
          DecoratorType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Tree]:
        return this.canvasManager.addTree(
          node.x,
          node.y,
          node.identifier,
          node.displayName
        );
      default:
        return {} as NodeGroup;
    }
  }
}
