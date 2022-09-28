import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'SweetPotatoDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'tree',
      storeConfig: { keyPath: 'identifier', autoIncrement: true },
      storeSchema: [
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
  ],
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(dbConfig)],
  declarations: [],
})
export class DataModule {}
