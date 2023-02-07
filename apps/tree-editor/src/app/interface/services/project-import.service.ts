import { Injectable } from '@angular/core';
import { first, Observable, switchMap } from 'rxjs';
import { SPNode } from '../../store/models/sp-node.model';
import { ProjectStoreService } from '../../store/services/project-store.service';
import { TreeStoreService } from '../../store/services/tree-store.service';
import { INode } from '../models/inode.model';
import { IProject } from '../models/iproject.model';

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
