import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { first, map, Observable, switchMap } from 'rxjs';
import { SPNode } from '../models/sp-node.model';
import { Destroy } from '@sweet-potato/core';

@Injectable({ providedIn: 'root' })
export class TreeStoreService extends Destroy {
  static readonly TREE_STORE = 'tree';
  static readonly LAST_ACTIVE_TREE = 'last_active_tree';
  static readonly IX_PROJECT = 'projectId';
  static readonly IX_IDENTIFIER = 'identifier';

  constructor(private dbService: NgxIndexedDBService) {
    super();
  }

  add(tree: SPNode): Observable<SPNode> {
    if (tree.id) throw new Error('node already added');
    return this.dbService.add(TreeStoreService.TREE_STORE, tree);
  }

  addRange(trees: SPNode[]): Observable<number[]> {
    return this.dbService.bulkAdd(TreeStoreService.TREE_STORE, trees);
  }

  update(tree: SPNode): Observable<SPNode> {
    if (!tree.id) {
      throw Error('Trying to update an new tree');
    }

    return this.dbService.update(TreeStoreService.TREE_STORE, tree);
  }

  delete(id: number): Observable<boolean> {
    return this.dbService.deleteByKey(TreeStoreService.TREE_STORE, id);
  }

  deleteByIdentifier(identifier: string): Observable<boolean> {
    return this.dbService
      .getByIndex<SPNode>(
        TreeStoreService.TREE_STORE,
        TreeStoreService.IX_IDENTIFIER,
        identifier
      )
      .pipe(
        first(),
        switchMap((tree) =>
          this.dbService.delete(TreeStoreService.TREE_STORE, tree.id)
        ),
        map(() => true)
      );
  }

  deleteByProjectId(id: number): Observable<boolean> {
    return this.dbService
      .getAllByIndex<SPNode>(
        TreeStoreService.TREE_STORE,
        TreeStoreService.IX_PROJECT,
        IDBKeyRange.only(id)
      )
      .pipe(
        first(),
        switchMap((trees) =>
          this.dbService.bulkDelete(
            TreeStoreService.TREE_STORE,
            trees.map((tree) => tree.id)
          )
        ),
        map(() => true)
      );
  }

  getAll(): Observable<SPNode[]> {
    return this.dbService
      .getAll(TreeStoreService.TREE_STORE)
      .pipe(map((result) => result.map((node) => node as SPNode)));
  }

  getByIdentifier(identifier: number): Observable<SPNode> {
    return this.dbService.getByID(TreeStoreService.TREE_STORE, identifier);
  }

  getAllByProjectId(projectId: number): Observable<SPNode[]> {
    return this.dbService.getAllByIndex(
      TreeStoreService.TREE_STORE,
      TreeStoreService.IX_PROJECT,
      IDBKeyRange.only(projectId)
    );
  }
}
