import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { SPEditorProjectConfig } from '../models/sp-editor-project-config.model';

@Injectable({ providedIn: 'root' })
export class EditorProjectConfigStoreService {
  static readonly EDITOR_PROJECT_CONFIG_STORE = 'project-config';

  constructor(private dbContext: NgxIndexedDBService) {}

  getConfig(projectId: number): Observable<SPEditorProjectConfig | undefined> {
    return this.dbContext.getByKey<SPEditorProjectConfig>(
      EditorProjectConfigStoreService.EDITOR_PROJECT_CONFIG_STORE,
      projectId
    );
  }

  setConfig(config: SPEditorProjectConfig): Observable<SPEditorProjectConfig> {
    return this.dbContext.update(
      EditorProjectConfigStoreService.EDITOR_PROJECT_CONFIG_STORE,
      config
    );
  }
}
