import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { WebpackTranslateLoader } from './shared/config/translate-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataModule } from './data/data.module';

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
    DataModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
