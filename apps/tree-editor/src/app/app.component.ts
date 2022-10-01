import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectStoreService } from './data/services/project-store.service';

@Component({
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tree-editor';

  constructor(translate: TranslateService, projectStore: ProjectStoreService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // load the last active project
    projectStore.loadLastActive();
  }
}
