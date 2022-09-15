import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { CameraService } from './services/camera.service';
import { DragService } from './services/drag.service';
import { EditorComponent } from './components/editor/editor.component';
import { InputService } from './services/input.service';
import { SandboxService } from './services/sandbox.service';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';

@NgModule({
  declarations: [NodesPanelComponent, EditorComponent, LeftPanelComponent],
  imports: [CommonModule, EditorRoutingModule, SharedModule],
  providers: [CameraService, DragService, InputService, SandboxService],
})
export class EditorModule {}
