import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SPLeafNode } from '../../store/models/sp-leaf-node.model';
import { LeafNodeStoreService } from '../../store/services/leaf-node-store.service';

@Injectable()
export class LeafNodeImportService {
  constructor(private leafNodeStore: LeafNodeStoreService) {}
  importLeafNodes(json: string): Observable<boolean> {
    const leafNodes = JSON.parse(json) as SPLeafNode[];
    return this.leafNodeStore.setLeafNodes(leafNodes).pipe(map(() => true));
  }
}
