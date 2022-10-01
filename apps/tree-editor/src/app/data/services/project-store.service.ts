import { createInjectableType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { take } from 'lodash-es';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable, of, switchMap, takeUntil } from 'rxjs';
import { Destroy } from '../../utils/components/destory';
import { SPProject } from '../models/sp-project.model';

@Injectable({ providedIn: 'root' })
export class ProjectStoreService extends Destroy {
  static readonly PROJECT_STORE = 'project';
  static readonly ACTIVE_PROJECT = 'active_project';

  allProjectsSubject = new BehaviorSubject<SPProject[]>([]);
  allProjects$ = this.allProjectsSubject.asObservable();

  activeSubject = new BehaviorSubject<SPProject | undefined>(undefined);
  active$ = this.activeSubject.asObservable();

  get active(): SPProject {
    return this.activeSubject.value;
  }

  constructor(private dbService: NgxIndexedDBService) {
    super();

    this.dbService
      .getAll<SPProject>(ProjectStoreService.PROJECT_STORE)
      .subscribe((projects) => this.allProjectsSubject.next(projects));
  }

  addProject(name: string): void {
    const project = <SPProject>{ name: name, rootNodeId: -1, isActive: false };

    this.dbService
      .add(ProjectStoreService.PROJECT_STORE, project)
      .pipe(
        switchMap(() =>
          this.dbService.getAll<SPProject>(ProjectStoreService.PROJECT_STORE)
        )
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }

  updateProject(project: SPProject): void {
    this.dbService
      .update(ProjectStoreService.PROJECT_STORE, project)
      .pipe(
        switchMap(() =>
          this.dbService.getAll<SPProject>(ProjectStoreService.PROJECT_STORE)
        )
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }

  deleteProject(id: number): void {
    this.dbService
      .deleteByKey(ProjectStoreService.PROJECT_STORE, id)
      .pipe(
        switchMap(() =>
          this.dbService.getAll<SPProject>(ProjectStoreService.PROJECT_STORE)
        )
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }

  setActive(project: SPProject) {
    localStorage.setItem(
      ProjectStoreService.ACTIVE_PROJECT,
      project.id.toString()
    );

    this.activeSubject.next(project);
  }

  loadLastActive(): void {
    const id = localStorage.getItem(ProjectStoreService.ACTIVE_PROJECT);
    if (id) {
      this.dbService
        .getByID<SPProject>(ProjectStoreService.PROJECT_STORE, parseInt(id))
        .subscribe((project) => {
          if (project) {
            this.activeSubject.next(project);
          }
        });
    }
  }
}
