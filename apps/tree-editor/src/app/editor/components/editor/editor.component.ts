import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DrawingService } from '../../drawing/drawing.service';
import { CommandService } from '../../services/command.service';
import { CanvasConnectionService } from '../../drawing/systems/canvas-connection.service';
import { LoaderService } from '../../services/loader.service';
import { ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { NodePanel } from '../left-panel/left-panel.component';
import { CanvasDragService } from '../../drawing/systems/canvas-drag.service';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasMouseService } from '../../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { CanvasService } from '../../drawing/systems/canvas.service';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CanvasMouseService,
    CommandService,
    CanvasSelectionService,
    CanvasConnectionService,
    DrawingService,
    CanvasManagerService,
    CanvasService,
    CanvasDragService,
    LoaderService,
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

  @HostListener('window:keydown.shift.a', ['$event'])
  addAction(event: KeyboardEvent): void {
    this.command.addAction();
  }

  @HostListener('window:keydown.shift.c', ['$event'])
  addCondition(event: KeyboardEvent): void {
    this.command.addCondition();
  }

  @HostListener('window:keydown.shift.s', ['$event'])
  addSelector(event: KeyboardEvent): void {
    this.command.addSelector();
  }

  @HostListener('window:keydown.shift.d', ['$event'])
  addDecorator(event: KeyboardEvent): void {
    this.command.addDecorator();
  }

  @HostListener('window:keydown.shift.t', ['$event'])
  addTree(event: KeyboardEvent): void {
    this.command.addTree();
  }
}
