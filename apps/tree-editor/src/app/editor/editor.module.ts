import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';
import { CameraService } from './services/camera.service';
import { DragService } from './services/drag.service';

@NgModule({
  declarations: [NodesPanelComponent],
  imports: [CommonModule, EditorRoutingModule, SharedModule],
  providers: [CameraService, DragService],
})
export class EditorModule {}
