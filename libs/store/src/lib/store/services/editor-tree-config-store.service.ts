import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { SPEditorTreeConfig } from '../models/sp-editor-tree-config.model';

@Injectable({ providedIn: 'root' })
export class EditorTreeConfigStoreService {
  static readonly EDITOR_TREE_CONFIG_STORE = 'tree-config';

  constructor(private dbContext: NgxIndexedDBService) {}

  getConfig(treeId: number): Observable<SPEditorTreeConfig | undefined> {
    return this.dbContext.getByKey<SPEditorTreeConfig>(
      EditorTreeConfigStoreService.EDITOR_TREE_CONFIG_STORE,
      treeId
    );
  }

  setConfig(config: SPEditorTreeConfig): Observable<SPEditorTreeConfig> {
    return this.dbContext.update(
      EditorTreeConfigStoreService.EDITOR_TREE_CONFIG_STORE,
      config
    );
  }
}
