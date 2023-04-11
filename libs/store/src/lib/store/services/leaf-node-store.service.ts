import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, switchMap } from 'rxjs';
import { SPLeafNode } from '../models/sp-leaf-node.model';

@Injectable({ providedIn: 'root' })
export class LeafNodeStoreService {
  static readonly LEAF_NODE_STORE = 'leaf-nodes';
  static readonly IX_NODE_TYPE = 'nodeType';
  static readonly NODE_TYPE_ACTION = 'Action';
  static readonly NODE_TYPE_CONDITION = 'Condition';

  constructor(private dbContext: NgxIndexedDBService) {}

  getLeafNodes(): Observable<SPLeafNode[]> {
    return this.dbContext.getAll(LeafNodeStoreService.LEAF_NODE_STORE);
  }

  setLeafNodes(leafNodes: SPLeafNode[]): Observable<number[]> {
    return this.dbContext
      .clear(LeafNodeStoreService.LEAF_NODE_STORE)
      .pipe(
        switchMap(() =>
          this.dbContext.bulkAdd(
            LeafNodeStoreService.LEAF_NODE_STORE,
            leafNodes
          )
        )
      );
  }

  getActions$(): Observable<SPLeafNode[]> {
    return this.dbContext.getAllByIndex<SPLeafNode>(
      LeafNodeStoreService.LEAF_NODE_STORE,
      LeafNodeStoreService.IX_NODE_TYPE,
      IDBKeyRange.only(LeafNodeStoreService.NODE_TYPE_ACTION)
    );
  }

  getConditions$(): Observable<SPLeafNode[]> {
    return this.dbContext.getAllByIndex<SPLeafNode>(
      LeafNodeStoreService.LEAF_NODE_STORE,
      LeafNodeStoreService.IX_NODE_TYPE,
      IDBKeyRange.only(LeafNodeStoreService.NODE_TYPE_CONDITION)
    );
  }
}
