import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { SPNode } from '../../store/models/sp-node.model';
import { SPProject } from '../../store/models/sp-project.model';
import { ProjectStoreService } from '../../store/services/project-store.service';
import { TreeStoreService } from '../../store/services/tree-store.service';

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
