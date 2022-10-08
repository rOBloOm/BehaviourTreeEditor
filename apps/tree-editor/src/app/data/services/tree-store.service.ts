import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';
import { Destroy } from '../../utils/components/destory';
import { SPNode } from '../models/sp-node.model';

@Injectable({ providedIn: 'root' })
export class TreeStoreService extends Destroy {
  static readonly TREE_STORE = 'tree';
  static readonly LAST_ACTIVE_TREE = 'last_active_tree';
  static readonly IX_PROJECT = 'projectId';

  constructor(private dbService: NgxIndexedDBService) {
    super();
  }

  add(tree: SPNode): Observable<SPNode> {
    if (tree.identifier) throw new Error('node already added');
    delete tree.identifier;
    return this.dbService.add(TreeStoreService.TREE_STORE, tree);
  }

  update(tree: SPNode): Observable<SPNode> {
    if (!tree.identifier) {
      throw Error('Trying to update an new tree');
    }

    return this.dbService.update(TreeStoreService.TREE_STORE, tree);
  }

  delete(identifier: number): Observable<boolean> {
    return this.dbService.deleteByKey(TreeStoreService.TREE_STORE, identifier);
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
