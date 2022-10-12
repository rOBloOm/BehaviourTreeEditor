import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { SPNode } from '../../data/models/sp-node.model';
import { SPProject } from '../../data/models/sp-project.model';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { TreeStoreService } from '../../data/services/tree-store.service';

@Injectable()
export class ProjectFactoryService {
  constructor(
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService
  ) {}

  createProject(name: string): Observable<SPProject> {
    return this.projectStore.addProject(name).pipe(
      switchMap((project) =>
        combineLatest([
          of(project),
          this.treeStore.add(<SPNode>{
            type: 'Root',
            displayName: 'Root',
            projectId: project.id,
            x: 700,
            y: 200,
          }),
        ])
      ),
      switchMap(([project, tree]) => {
        project.rootNodeIdentifier = tree.identifier;
        return this.projectStore.updateProject(project);
      })
    );
  }
}
