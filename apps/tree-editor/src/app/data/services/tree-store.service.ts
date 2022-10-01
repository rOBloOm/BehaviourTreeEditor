import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { SPNode } from '../models/sp-node.model';
import { DataExport } from '../utils/data-export.util';

@Injectable({ providedIn: 'root' })
export class TreeStoreService {
  static readonly TREE_STORE = 'tree';
  static readonly LAST_ACTIVE_TREE = 'last_active_tree';

  constructor(private dbService: NgxIndexedDBService) {}

  add(root: NodeGroup): Observable<SPNode> {
    const data = DataExport.convert(root);
    delete data.identifier;
    return this.dbService.add(TreeStoreService.TREE_STORE, data);
  }

  update(root: NodeGroup): Observable<SPNode> {
    const data = DataExport.convert(root);
    if (root.identifier === '') {
      return this.add(root);
    } else {
      return this.dbService.update(TreeStoreService.TREE_STORE, data);
    }
  }

  delete(identifier: number): void {
    this.dbService
      .deleteByKey(TreeStoreService.TREE_STORE, identifier)
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
