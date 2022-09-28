import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { map, Observable } from 'rxjs';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { SPNode } from '../models/sp-node.model';
import { DataExport } from '../utils/data-export.util';

@Injectable()
export class StorageService {
  private readonly lastActive = 'last_active_tree_identifier';
  private readonly treeStore = 'tree';

  constructor(private dbService: NgxIndexedDBService) {}

  getActiveTree(): string {
    return localStorage.getItem(this.lastActive);
  }

  setActiveTree(identifier: string): void {
    localStorage.setItem(this.lastActive, identifier);
  }

  add(root: NodeGroup): Observable<SPNode> {
    const data = DataExport.convert(root);
    delete data.identifier;
    return this.dbService.add(this.treeStore, data);
  }

  update(root: NodeGroup): Observable<SPNode> {
    const data = DataExport.convert(root);
    if (root.identifier === '') {
      return this.add(root);
    } else {
      return this.dbService.update(this.treeStore, data);
    }
  }

  loadAll(): Observable<SPNode[]> {
    return this.dbService
      .getAll(this.treeStore)
      .pipe(map((result) => result.map((node) => node as SPNode)));
  }

  load(identifier: string): Observable<SPNode> {
    return this.dbService.getByKey(this.treeStore, Number.parseInt(identifier));
  }
}
