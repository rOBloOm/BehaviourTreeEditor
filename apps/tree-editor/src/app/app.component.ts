import { Component } from '@angular/core';
import { ProjectStoreService } from './data/services/project-store.service';

@Component({
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tree-editor';

  constructor(projectStore: ProjectStoreService) {
    // load the last active project
    projectStore.loadLastActive();
  }
}
