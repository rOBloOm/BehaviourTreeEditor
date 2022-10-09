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
  constructor(private canvas: CanvasManagerService) {}

  import(root: SPNode, trees: SPNode[]) {
    this.canvas.clear();
    const rootNode = this.canvas.addRootNode(
      root.x,
      root.y,
      root.identifier,
      root.displayName
    );
    this.appendChildrenTo(root.children, rootNode, trees);
  }

  private appendChildrenTo(
    children: SPNode[],
    parent: NodeGroup,
    trees: SPNode[]
  ): void {
    forEach(children, (child) => {
      const childNode = this.createNodeFrom(child, trees);
      this.canvas.connect(parent, childNode);
      this.appendChildrenTo(child.children, childNode, trees);
    });
  }

  private createNodeFrom(node: SPNode, trees: SPNode[]): NodeGroup {
    switch (node.type) {
      case NodeGroupType[NodeGroupType.Action]:
        return this.canvas.addActionNode(
          node.x,
          node.y,
          node.identifier,
          node.displayName
        );
      case NodeGroupType[NodeGroupType.Composite]:
        return this.canvas.addCompositeNode(
          node.x,
          node.y,
          CompositeType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Condition]:
        return this.canvas.addConditionNode(
          node.x,
          node.y,
          node.identifier,
          node.displayName
        );
      case NodeGroupType[NodeGroupType.Decorator]:
        return this.canvas.addDecorator(
          node.x,
          node.y,
          DecoratorType[node.displayName]
        );
      case NodeGroupType[NodeGroupType.Tree]:
        //Look up the tree desplayname in case it has been updated
        const displayName =
          trees.find((tree) => tree.identifier === node.identifier)
            ?.displayName ?? node.displayName;

        return this.canvas.addTree(
          node.x,
          node.y,
          node.identifier,
          displayName
        );
      default:
        return {} as NodeGroup;
    }
  }
}
