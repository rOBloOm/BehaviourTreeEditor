import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Destroy } from '../../../base/components/destory';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CommandService } from '../../services/command.service';
import { EditorManagerService } from '../../services/editor-manager.service';
import { NodePanel } from '../left-panel/left-panel.component';

@Component({
  selector: 'sp-editor-menu-bar',
  templateUrl: './editor-menu-bar.component.html',
  styleUrls: ['./editor-menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorMenuBarComponent extends Destroy implements OnInit {
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

  ngOnInit(): void {}

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
