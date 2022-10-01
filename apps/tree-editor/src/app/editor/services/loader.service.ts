import { Injectable } from '@angular/core';
import { CanvasService } from './canvas.service';
import { CanvasManagerService } from './canvas-manager.service';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { TreeStoreService } from '../../data/services/tree-store.service';
import { forEach } from 'lodash-es';
import { SPNode } from '../../data/models/sp-node.model';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { NodeGroupType } from '../drawing/enums/node-group-type.enum';
import { NodeGroup } from '../drawing/models/node-group.model';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { filter, switchMap, takeUntil, takeWhile } from 'rxjs';
import { Destroy } from '../../utils/components/destory';

@Injectable()
export class LoaderService extends Destroy {
  constructor(
    private manager: CanvasManagerService,
    private canvas: CanvasService,
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService
  ) {
    super();
  }

  init(): void {
    this.projectStore.active$
      .pipe(
        takeUntil(this.destroy$),
        filter((value) => value !== undefined),
        switchMap((project) => this.treeStore.load(project.rootNodeId))
      )
      .subscribe((root) => {
        if (root) {
          this.import(root);
        } else {
          this.addInitialNode();
        }
      });
  }

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

  private addInitialNode(): void {
    const x = this.canvas.two.width * 0.5;
    const y = this.canvas.two.height * 0.2;
    this.manager.addRootNode(x, y, '', 'NewTree');
  }
}
