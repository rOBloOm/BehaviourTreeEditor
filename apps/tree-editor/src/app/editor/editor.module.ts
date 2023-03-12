import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { EditorComponent } from './components/editor/editor.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { EditorMenuBarComponent } from './components/editor-menu-bar/editor-menu-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteTreeDialogComponent } from './components/delete-tree-dialog/delete-tree-dialog.component';
import { RightPanelParametersComponent } from './components/right-panel-parameters/right-panel-parameters.component';

@NgModule({
  declarations: [
    NodesPanelComponent,
    EditorComponent,
    LeftPanelComponent,
    RightPanelComponent,
    EditorMenuBarComponent,
    DeleteTreeDialogComponent,
    RightPanelParametersComponent,
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    KeyboardShortcutsModule.forRoot(),
    NgbAccordionModule,
  ],
})
export class EditorModule {}
