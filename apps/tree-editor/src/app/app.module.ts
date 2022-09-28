import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { WebpackTranslateLoader } from './shared/config/translate-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      },
    }),
    ToastrModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
