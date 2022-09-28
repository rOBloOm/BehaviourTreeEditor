import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { CanvasService as CanvasService } from './services/canvas.service';
import { DragService } from './services/drag.service';
import { EditorComponent } from './components/editor/editor.component';
import { MouseInputService } from './services/mouse-input.service';
import { LoaderService } from './services/loader.service';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { DrawingService } from './drawing/drawing.service';
import { SelectionService } from './services/selection.service';
import { CanvasManagerService } from './services/canvas-manager.service';
import { ConnectionService } from './services/connection.service';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { EditorMenuBarComponent } from './components/editor-menu-bar/editor-menu-bar.component';
import { StorageService } from '../data/services/storage.service';
import { CommandService } from './services/command.service';
import { ImportService } from '../data/services/import.service';
import { ReactiveFormsModule } from '@angular/forms';

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
  providers: [
    CanvasService,
    DragService,
    MouseInputService,
    LoaderService,
    DrawingService,
    SelectionService,
    CanvasManagerService,
    ConnectionService,
    StorageService,
    CommandService,
    ImportService,
  ],
})
export class EditorModule {}
