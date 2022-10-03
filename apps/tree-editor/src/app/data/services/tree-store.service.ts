import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { Destroy } from '../../utils/components/destory';
import { SPNode } from '../models/sp-node.model';
import { DataExport } from '../utils/data-export.util';
import { ProjectStoreService } from './project-store.service';

@Injectable({ providedIn: 'root' })
export class TreeStoreService extends Destroy {
  static readonly TREE_STORE = 'tree';
  static readonly LAST_ACTIVE_TREE = 'last_active_tree';
  static readonly IX_PROJECT = 'projectId';

  trees$: Observable<SPNode[]>;
  treesChangedSubject = new Subject<boolean>();

  constructor(
    private dbService: NgxIndexedDBService,
    private projectStore: ProjectStoreService
  ) {
    super();

    this.trees$ = combineLatest([
      projectStore.active$,
      this.treesChangedSubject.asObservable().pipe(startWith(false)),
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([project]) => {
        if (!project) return of([] as SPNode[]);
        return this.dbService.getAllByIndex<SPNode>(
          TreeStoreService.TREE_STORE,
          TreeStoreService.IX_PROJECT,
          IDBKeyRange.only(project.id)
        );
      })
    );
  }

  add(root: NodeGroup): Observable<SPNode> {
    const data = DataExport.convert(root);
    delete data.identifier;
    data.projectId = this.projectStore.active.id;
    return this.dbService
      .add(TreeStoreService.TREE_STORE, data)
      .pipe(tap(() => this.treesChangedSubject.next(true)));
  }

  update(root: NodeGroup): Observable<SPNode> {
    if (!root.identifier) {
      throw Error('Trying to update an new tree');
    }

    const data = DataExport.convert(root);
    data.projectId = this.projectStore.active.id;
    return this.dbService
      .update(TreeStoreService.TREE_STORE, data)
      .pipe(tap(() => this.treesChangedSubject.next(true)));
  }

  delete(identifier: number): void {
    this.dbService
      .deleteByKey(TreeStoreService.TREE_STORE, identifier)
      .pipe(tap(() => this.treesChangedSubject.next(true)))
      .subscribe({
        error: (err) => {
          throw new Error(err);
        },
      });
  }

  loadAll(): Observable<SPNode[]> {
    return this.dbService
      .getAll(TreeStoreService.TREE_STORE)
      .pipe(map((result) => result.map((node) => node as SPNode)));
  }

  load(identifier: number): Observable<SPNode> {
    return this.dbService.getByID(TreeStoreService.TREE_STORE, identifier);
  }
}
