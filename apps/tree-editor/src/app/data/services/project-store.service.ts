import { createInjectableType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable, switchMap, takeUntil } from 'rxjs';
import { Destroy } from '../../utils/components/destory';
import { SPProject } from '../models/sp-project.model';

@Injectable({ providedIn: 'root' })
export class ProjectStoreService extends Destroy {
  private readonly projectStore = 'project';

  allProjectsSubject = new BehaviorSubject<SPProject[]>([]);
  allProjects$ = this.allProjectsSubject.asObservable();

  constructor(private dbService: NgxIndexedDBService) {
    super();

    this.dbService
      .getAll<SPProject>(this.projectStore)
      .subscribe((projects) => this.allProjectsSubject.next(projects));
  }

  addProject(name: string): void {
    const project = <SPProject>{ name: name, rootNodeId: -1 };

    this.dbService
      .add(this.projectStore, project)
      .pipe(
        switchMap(() => this.dbService.getAll<SPProject>(this.projectStore))
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }

  updateProject(project: SPProject): void {
    this.dbService
      .update(this.projectStore, project)
      .pipe(
        switchMap(() => this.dbService.getAll<SPProject>(this.projectStore))
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }

  deleteProject(id: number): void {
    this.dbService
      .deleteByKey(this.projectStore, id)
      .pipe(
        switchMap(() => this.dbService.getAll<SPProject>(this.projectStore))
      )
      .subscribe((projects) => {
        this.allProjectsSubject.next(projects);
      });
  }
}
