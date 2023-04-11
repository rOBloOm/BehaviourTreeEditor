import {
  EnvironmentProviders,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { TreeStoreService } from './lib/store/services/tree-store.service';
import { EditorProjectConfigStoreService } from './lib/store/services/editor-project-config-store.service';
import { EditorTreeConfigStoreService } from './lib/store/services/editor-tree-config-store.service';
import { LeafNodeStoreService } from './lib/store/services/leaf-node-store.service';
import { ProjectStoreService } from './lib/store/services/project-store.service';

export function provideStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
  ]);
}

const dbConfig: DBConfig = {
  name: 'SweetPotatoDb',
  version: 1,
  objectStoresMeta: [
    {
      store: TreeStoreService.TREE_STORE,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'identifier',
          keypath: 'identifier',
          options: { unique: true },
        },
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
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'identifier',
          keypath: 'identifier',
          options: { unique: false },
        },
        { name: 'displayName', keypath: '', options: { unique: false } },
        { name: 'nodeType', keypath: 'nodeType', options: { unique: false } },
      ],
    },
  ],
  migrationFactory,
};

export function migrationFactory() {
  return {
    1: (db: any, transaction: any) => {
      const store = transaction.objectStore(TreeStoreService.TREE_STORE);
      store.createIndex(
        TreeStoreService.IX_PROJECT,
        TreeStoreService.IX_PROJECT,
        { unique: false }
      );
    },
  };
}
