import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ProjectStoreService } from './services/project-store.service';
import { TreeStoreService } from './services/tree-store.service';

export function migrationFactory() {
  // The animal table was added with version 2 but none of the existing tables or data needed
  // to be modified so a migrator for that version is not included.
  return {
    1: (db, transaction) => {
      const store = transaction.objectStore(TreeStoreService.TREE_STORE);
      store.createIndex(
        TreeStoreService.IX_PROJECT,
        TreeStoreService.IX_PROJECT,
        { unique: false }
      );
    },
  };
}

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
  migrationFactory,
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(dbConfig)],
  declarations: [],
})
export class DataModule {}
