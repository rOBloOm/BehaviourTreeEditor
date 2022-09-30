import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { EditorComponent } from './components/editor/editor.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { EditorMenuBarComponent } from './components/editor-menu-bar/editor-menu-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../data/services/storage.service';

@NgModule({
  declarations: [
    NodesPanelComponent,
    EditorComponent,
    LeftPanelComponent,
    RightPanelComponent,
    EditorMenuBarComponent,
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  providers: [StorageService],
})
export class EditorModule {}
