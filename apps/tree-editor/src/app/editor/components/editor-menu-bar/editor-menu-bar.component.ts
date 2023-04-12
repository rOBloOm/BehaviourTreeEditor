import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CommandService } from '../../services/command.service';
import { EditorManagerService } from '../../services/editor-manager.service';
import { NodePanel } from '../left-panel/left-panel.component';
import { Destroy } from '@sweet-potato/core';
import { AsyncPipe } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-editor-menu-bar',
  templateUrl: './editor-menu-bar.component.html',
  styleUrls: ['./editor-menu-bar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, FlexModule, RouterLink],
})
export class EditorMenuBarComponent extends Destroy {
  get projectName$(): Observable<string> {
    return this.editorManager.activeProject$.pipe(
      map((project) => project?.name ?? '')
    );
  }

  get treeName$(): Observable<string> {
    return this.canvasManager.rootDisplayName$;
  }

  constructor(
    private canvasManager: CanvasManagerService,
    private command: CommandService,
    private editorManager: EditorManagerService
  ) {
    super();
  }

  addNewTree(): void {
    this.command.newTree();
  }

  openTreePanel(): void {
    this.command.openPanel(NodePanel.AccTree);
  }

  openActionPanel(): void {
    this.command.openPanel(NodePanel.AccAction);
  }

  openConditionPanel(): void {
    this.command.openPanel(NodePanel.AccCondition);
  }

  openDecoratorPanel(): void {
    this.command.openPanel(NodePanel.AccDecorator);
  }

  openCompositePanel(): void {
    this.command.openPanel(NodePanel.AccComposite);
  }

  saveActiveTree(): void {
    this.command.saveActiveTree();
  }
}
