import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { first, map, Observable } from 'rxjs';
import { SPNode } from '../../data/models/sp-node.model';
import { SPProject } from '../../data/models/sp-project.model';
import { TreeStoreService } from '../../data/services/tree-store.service';

@Injectable({ providedIn: 'root' })
export class ProjectExportService {
  constructor(private treeStore: TreeStoreService) {}

  exportProject(project: SPProject): Observable<string> {
    return this.treeStore.getAllByProjectId(project.id).pipe(
      first(),
      map((trees) => {
        return JSON.stringify({
          project: {
            name: project.name,
            rootNodeId: project.rootNodeIdentifier,
          },
          trees,
        });
      })
    );
  }

  //Possibly is not gonna happen this way, delete all code bellow if not needed
  exportProject_old(project: SPProject): Observable<string> {
    return this.treeStore.getAllByProjectId(project.id).pipe(
      first(),
      map((trees) => {
        const root = trees.find(
          (tree) => tree.identifier === project.rootNodeIdentifier
        );
        this.traverseNode(root, trees);
        return JSON.stringify(root);
      })
    );
  }

  traverseNode(node: SPNode, trees: SPNode[]): void {
    const children = node.children;
    node.children = [];

    forEach(children, (child) => {
      while (child.type === 'Tree') {
        child = this.substituteSubtree(child, trees);
      }
      this.traverseNode(child, trees);
      node.children.push(child);
    });
  }

  substituteSubtree(tree: SPNode, nodes: SPNode[]): SPNode {
    const otherTree = nodes.find((node) => node.identifier === tree.identifier);
    return otherTree.children[0];
  }
}
