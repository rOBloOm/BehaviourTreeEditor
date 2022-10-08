import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CanvasDrawingService } from '../../drawing/systems/canvas-drawing.service';
import { CommandService } from '../../services/command.service';
import { CanvasConnectionService } from '../../drawing/systems/canvas-connection.service';
import {
  AllowIn,
  ShortcutEventOutput,
  ShortcutInput,
} from 'ng-keyboard-shortcuts';
import { NodePanel } from '../left-panel/left-panel.component';
import { CanvasDragService } from '../../drawing/systems/canvas-drag.service';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasMouseService } from '../../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { CanvasService } from '../../drawing/systems/canvas.service';
import { CanvasDropService } from '../../drawing/systems/canvas-drop.service';
import { EditorManagerService } from '../../services/editor-manager.service';
import { TreeExportSerive } from '../../services/tree-export.service';
import { TreeImportService } from '../../services/tree-import.service';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
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
})
export class EditorComponent implements AfterViewInit {
  shortcuts: ShortcutInput[] = [];

  constructor(private titleService: Title, private command: CommandService) {}

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'cmd + s',
        command: (output: ShortcutEventOutput) => this.command.saveActiveTree(),
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
        command: (output: ShortcutEventOutput) => this.command.newTree(),
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
        command: (output: ShortcutEventOutput) =>
          this.command.openPanel(NodePanel.AccTree),
        preventDefault: true,
      },
      {
        key: 'a a',
        command: (output: ShortcutEventOutput) =>
          this.command.openPanel(NodePanel.AccAction),
        preventDefault: true,
      },
      {
        key: 'a c',
        command: (output: ShortcutEventOutput) =>
          this.command.openPanel(NodePanel.AccCondition),
        preventDefault: true,
      },
      {
        key: 'a d',
        command: (output: ShortcutEventOutput) =>
          this.command.openPanel(NodePanel.AccDecorator),
        preventDefault: true,
      },
      {
        key: 'a f',
        command: (output: ShortcutEventOutput) =>
          this.command.openPanel(NodePanel.AccComposite),
        preventDefault: true,
      },
      {
        key: ['x', 'del'],
        command: (output: ShortcutEventOutput) => this.command.deleteSelected(),
        preventDefault: true,
      }
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Behaviour Tree Editor');
  }
}
