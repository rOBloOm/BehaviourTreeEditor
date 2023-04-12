import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SPProject } from '../models/sp-project.model';
import { Destroy } from '@sweet-potato/core';

@Injectable({ providedIn: 'root' })
export class ProjectStoreService extends Destroy {
  static readonly PROJECT_STORE = 'project';
  static readonly ACTIVE_PROJECT = 'active_project';

  private projectsChangedSubject = new BehaviorSubject<boolean>(false);
  projectsChanged$ = this.projectsChangedSubject.asObservable();

  allProjects$: Observable<SPProject[]>;

  private projectDeletedSubject = new Subject<number>();
  deleted$ = this.projectDeletedSubject.asObservable();

  constructor(private dbService: NgxIndexedDBService) {
    super();

    this.allProjects$ = this.projectsChangedSubject.pipe(
      takeUntil(this.destroy$),
      switchMap(() =>
        this.dbService.getAll<SPProject>(ProjectStoreService.PROJECT_STORE)
      )
    );

    this.projectsChangedSubject.next(true);
  }

  addProject(name: string): Observable<SPProject> {
    const project = <SPProject>{
      name: name,
      rootNodeIdentifier: undefined,
      isActive: false,
    };

    return this.dbService.add(ProjectStoreService.PROJECT_STORE, project);
  }

  addProjectWith(
    name: string,
    rootNodeIdentifier: string
  ): Observable<SPProject> {
    const project = <SPProject>{
      name: name,
      rootNodeIdentifier: rootNodeIdentifier,
      isActive: false,
    };
    return this.dbService.add(ProjectStoreService.PROJECT_STORE, project);
  }

  updateProject(project: SPProject): Observable<SPProject> {
    return this.dbService.update(ProjectStoreService.PROJECT_STORE, project);
  }

  deleteProject(id: number): Observable<boolean> {
    return this.dbService.deleteByKey(ProjectStoreService.PROJECT_STORE, id);
  }

  saveActiveProject(project: SPProject) {
    localStorage.setItem(
      ProjectStoreService.ACTIVE_PROJECT,
      project.id.toString()
    );
  }

  loadActiveProject(): Observable<SPProject | undefined> {
    const id = localStorage.getItem(ProjectStoreService.ACTIVE_PROJECT);
    if (id) {
      return this.dbService.getByKey(
        ProjectStoreService.PROJECT_STORE,
        parseInt(id)
      );
    }
    return of(undefined);
  }
}