import { Injectable } from '@angular/core';
import { first, from, Observable, switchMap } from 'rxjs';
import { INode } from '../models/inode.model';
import { IProject } from '../models/iproject.model';
import {
  ProjectStoreService,
  SPNode,
  TreeStoreService,
} from '@sweet-potato/store';

@Injectable({ providedIn: 'root' })
export class ProjectImportService {
  constructor(
    private treeStore: TreeStoreService,
    private projectStore: ProjectStoreService
  ) {}

  importProject(json: string): Observable<number[]> {
    const content = JSON.parse(json);
    const project = content.project as IProject;
    const trees = content.trees as INode[];

    if (project === undefined || trees === undefined) {
      return from([]);
    }

    return this.projectStore
      .addProjectWith(project.name, project.rootNodeIdentifier)
      .pipe(
        first(),
        switchMap((project) =>
          this.treeStore.addRange(
            trees.map((tree) => this.mapNode(tree, project.id))
          )
        )
      );
  }

  mapNode(node: INode, projectId: number): SPNode {
    return <SPNode>{
      displayName: node.displayName,
      projectId: projectId,
      type: node.type,
      identifier: node.identifier,
      children: node.children.map((child) => this.mapNode(child, projectId)),
      parameters: node.parameters,
      x: node.x,
      y: node.y,
    };
  }
}
