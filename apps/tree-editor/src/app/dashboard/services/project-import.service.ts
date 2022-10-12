import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { first, map, Observable, switchMap } from 'rxjs';
import { SPNode } from '../../data/models/sp-node.model';
import { SPProject } from '../../data/models/sp-project.model';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { TreeStoreService } from '../../data/services/tree-store.service';

@Injectable({ providedIn: 'root' })
export class ProjectImportService {
  constructor(
    private treeStore: TreeStoreService,
    private projectStore: ProjectStoreService
  ) {}

  importProject(json: string): Observable<number[]> {
    const content = JSON.parse(json);
    const project = content.project as SPProject;
    const trees = content.trees as SPNode[];

    return this.projectStore
      .addProjectWith(project.name, project.rootNodeIdentifier)
      .pipe(
        first(),
        switchMap((project) => {
          forEach(trees, (tree) => (tree.projectId = project.id));
          return this.treeStore.addRange(trees);
        })
      );
  }
}
