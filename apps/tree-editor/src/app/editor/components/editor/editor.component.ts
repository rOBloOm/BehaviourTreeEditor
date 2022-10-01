import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MouseInputService } from '../../services/mouse-input.service';
import { DrawingService } from '../../drawing/drawing.service';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { CanvasService } from '../../services/canvas.service';
import { CommandService } from '../../services/command.service';
import { ConnectionService } from '../../services/connection.service';
import { DragService } from '../../services/drag.service';
import { LoaderService } from '../../services/loader.service';
import { SelectionService } from '../../services/selection.service';
import { ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { NodePanel } from '../left-panel/left-panel.component';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MouseInputService,
    CommandService,
    SelectionService,
    ConnectionService,
    DrawingService,
    CanvasManagerService,
    CanvasService,
    DragService,
    LoaderService,
  ],
})
export class EditorComponent implements AfterViewInit {
  shortcuts: ShortcutInput[] = [];

  constructor(private titleService: Title, private command: CommandService) {}

  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'cmd + s',
      command: (output: ShortcutEventOutput) => this.command.saveActiveTree(),
      preventDefault: true,
    });
    this.shortcuts.push({
      key: 'a t',
      command: (output: ShortcutEventOutput) =>
        this.command.openPanel(NodePanel.AccTree),
      preventDefault: true,
    });
    this.shortcuts.push({
      key: 'a a',
      command: (output: ShortcutEventOutput) =>
        this.command.openPanel(NodePanel.AccAction),
      preventDefault: true,
    });
    this.shortcuts.push({
      key: 'a c',
      command: (output: ShortcutEventOutput) =>
        this.command.openPanel(NodePanel.AccCondition),
      preventDefault: true,
    });
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

  @HostListener('window:keydown.shift.x', ['$event'])
  @HostListener('window:keydown.delete', ['$event'])
  delete(): void {
    this.command.deleteSelected();
  }
}
