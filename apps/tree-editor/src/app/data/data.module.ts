import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { EditorProjectConfigStoreService } from './services/editor-project-config-store.service';
import { EditorTreeConfigStoreService } from './services/editor-tree-config-store.service';
import { LeafNodeStoreService } from './services/leaf-node-store.service';
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
    {
      store: EditorProjectConfigStoreService.EDITOR_PROJECT_CONFIG_STORE,
      storeConfig: { keyPath: 'projectId', autoIncrement: false },
      storeSchema: [
        { name: 'activeTreeId', keypath: '', options: { unique: false } },
      ],
    },
    {
      store: EditorTreeConfigStoreService.EDITOR_TREE_CONFIG_STORE,
      storeConfig: { keyPath: 'treeId', autoIncrement: false },
      storeSchema: [
        { name: 'x', keypath: '', options: { unique: false } },
        { name: 'y', keypath: '', options: { unique: false } },
        { name: 'zoom', keypath: '', options: { unique: false } },
      ],
    },
    {
      store: LeafNodeStoreService.LEAF_NODE_STORE,
      storeConfig: { keyPath: 'identifier', autoIncrement: false },
      storeSchema: [
        { name: 'displayName', keypath: '', options: { unique: false } },
        { name: 'nodeType', keypath: 'nodeType', options: { unique: false } },
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
