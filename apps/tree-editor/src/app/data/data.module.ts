import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ProjectStoreService } from './services/project-store.service';
import { TreeStoreService } from './services/tree-store.service';

const dbConfig: DBConfig = {
  name: 'SweetPotatoDb',
  version: 1,
  objectStoresMeta: [
    {
      store: TreeStoreService.TREE_STORE,
      storeConfig: { keyPath: 'identifier', autoIncrement: true },
      storeSchema: [
        {
          name: 'project',
          keypath: 'project',
          options: { unique: false },
        },
        {
          name: 'displayName',
          keypath: '',
          options: { unique: false },
        },
        { name: 'x', keypath: '', options: { unique: false } },
        { name: 'y', keypath: '', options: { unique: false } },
        { name: 'children', keypath: '', options: { unique: false } },
      ],
    },
    {
      store: ProjectStoreService.PROJECT_STORE,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: '', options: { unique: false } },
        { name: 'rootNodeId', keypath: '', options: { unique: false } },
        { name: 'isActive', keypath: 'isActive', options: { unique: false } },
      ],
    },
  ],
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(dbConfig)],
  declarations: [],
})
export class DataModule {}
