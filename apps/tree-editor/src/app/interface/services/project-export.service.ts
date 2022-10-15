import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { SPNode } from '../../store/models/sp-node.model';
import { SPProject } from '../../store/models/sp-project.model';
import { TreeStoreService } from '../../store/services/tree-store.service';
import { INode } from '../models/inode.model';
import { IProject } from '../models/iproject.model';

@Injectable({ providedIn: 'root' })
export class ProjectExportService {
  constructor(private treeStore: TreeStoreService) {}

  exportProject(project: SPProject): Observable<string> {
    return this.treeStore.getAllByProjectId(project.id).pipe(
      first(),
      map((trees) => {
        return JSON.stringify({
          project: <IProject>{
            name: project.name,
            rootNodeIdentifier: project.rootNodeIdentifier,
          },
          trees: trees.map((tree) => this.mapNode(tree)),
        });
      })
    );
  }

  mapNode(node: SPNode): INode {
    return <INode>{
      identifier: node.identifier,
      type: node.type,
      displayName: node.displayName,
      children: node.children.map((child) => this.mapNode(child)),
      //Editor settings
      x: node.x,
      y: node.y,
    };
  }
}