import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AllowIn,
  KeyboardShortcutsModule,
  ShortcutInput,
} from 'ng-keyboard-shortcuts';
import { CanvasConnectionService } from '../../drawing/systems/canvas-connection.service';
import { CanvasDragService } from '../../drawing/systems/canvas-drag.service';
import { CanvasDrawingService } from '../../drawing/systems/canvas-drawing.service';
import { CanvasDropService } from '../../drawing/systems/canvas-drop.service';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasMouseService } from '../../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { CanvasService } from '../../drawing/systems/canvas.service';
import { CommandService } from '../../services/command.service';
import { EditorManagerService } from '../../services/editor-manager.service';
import { TreeExportSerive } from '../../services/tree-export.service';
import { TreeImportService } from '../../services/tree-import.service';
import { NodePanel } from '../left-panel/left-panel.component';
import { EditorMenuBarComponent } from '../editor-menu-bar/editor-menu-bar.component';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { NodesPanelComponent } from '../nodes-panel/nodes-panel.component';
import { RightPanelComponent } from '../right-panel/right-panel.component';
import { FlexModule } from '@angular/flex-layout';
@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CanvasService,
    CanvasMouseService,
    CanvasSelectionService,
    CanvasConnectionService,
    CanvasDrawingService,
    CommandService,
    CanvasManagerService,
    CanvasDragService,
    CanvasDropService,
    EditorManagerService,
    TreeExportSerive,
    TreeImportService,
  ],
  imports: [
    EditorMenuBarComponent,
    LeftPanelComponent,
    NodesPanelComponent,
    RightPanelComponent,
    KeyboardShortcutsModule,
    FlexModule,
  ],
})
export class EditorComponent implements AfterViewInit, OnInit {
  shortcuts: ShortcutInput[] = [];

  constructor(private titleService: Title, private command: CommandService) {}

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'cmd + s',
        command: () => this.command.saveActiveTree(),
        preventDefault: true,
        allowIn: [
          AllowIn.Input,
          AllowIn.Select,
          AllowIn.Textarea,
          AllowIn.ContentEditable,
        ],
      },
      {
        key: 'shift + n',
        command: () => this.command.newTree(),
        preventDefault: true,
        allowIn: [
          AllowIn.Input,
          AllowIn.Select,
          AllowIn.Textarea,
          AllowIn.ContentEditable,
        ],
      },
      {
        key: 'a t',
        command: () => this.command.openPanel(NodePanel.AccTree),
        preventDefault: true,
      },
      {
        key: 'a a',
        command: () => this.command.openPanel(NodePanel.AccAction),
        preventDefault: true,
      },
      {
        key: 'a c',
        command: () => this.command.openPanel(NodePanel.AccCondition),
        preventDefault: true,
      },
      {
        key: 'a d',
        command: () => this.command.openPanel(NodePanel.AccDecorator),
        preventDefault: true,
      },
      {
        key: 'a f',
        command: () => this.command.openPanel(NodePanel.AccComposite),
        preventDefault: true,
      },
      {
        key: ['x', 'del'],
        command: () => this.command.deleteSelected(),
        preventDefault: true,
      }
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Behaviour Tree Editor');
  }
}
