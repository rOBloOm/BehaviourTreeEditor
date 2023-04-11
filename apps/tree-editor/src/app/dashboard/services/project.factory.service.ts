import { Injectable } from '@angular/core';
import {
  ProjectStoreService,
  TreeStoreService,
  SPProject,
  SPNode,
} from '@sweet-potato/store';
import { combineLatest, Observable, of, switchMap } from 'rxjs';

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
            identifier: crypto.randomUUID(),
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
