import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { CanvasService as CanvasService } from './services/canvas.service';
import { DragService } from './services/drag.service';
import { EditorComponent } from './components/editor/editor.component';
import { InputService } from './services/input.service';
import { SandboxService } from './services/sandbox.service';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { ShapeService } from './services/shape.service';
import { SelectionService } from './services/selection.service';
import { NodeManagerService } from './services/node-manager.service';

@NgModule({
  declarations: [NodesPanelComponent, EditorComponent, LeftPanelComponent],
  imports: [CommonModule, EditorRoutingModule, SharedModule],
  providers: [
    CanvasService,
    DragService,
    InputService,
    SandboxService,
    ShapeService,
    SelectionService,
    NodeManagerService,
  ],
})
export class EditorModule {}
