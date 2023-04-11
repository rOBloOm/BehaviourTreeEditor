import { Injectable } from '@angular/core';
import { LeafNodeStoreService, SPLeafNode } from '@sweet-potato/store';
import { map, Observable } from 'rxjs';

@Injectable()
export class LeafNodeImportService {
  constructor(private leafNodeStore: LeafNodeStoreService) {}
  importLeafNodes(json: string): Observable<boolean> {
    const leafNodes = JSON.parse(json) as SPLeafNode[];
    return this.leafNodeStore.setLeafNodes(leafNodes).pipe(map(() => true));
  }
}
