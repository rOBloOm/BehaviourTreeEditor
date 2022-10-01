import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, map, Observable, takeUntil, tap } from 'rxjs';
import { ProjectStoreService } from '../../../data/services/project-store.service';
import { Destroy } from '../../../utils/components/destory';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'sp-editor-menu-bar',
  templateUrl: './editor-menu-bar.component.html',
  styleUrls: ['./editor-menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorMenuBarComponent extends Destroy implements OnInit {
  get projectName$(): Observable<string> {
    return this.projectStore.active$.pipe(
      takeUntil(this.destroy$),
      filter((project) => project !== undefined),
      map((project) => project.name)
    );
  }

  get treeName$(): Observable<string> {
    return this.manager.rootDisplayName$;
  }

  constructor(
    private command: CommandService,
    private manager: CanvasManagerService,
    private projectStore: ProjectStoreService
  ) {
    super();
  }

  ngOnInit(): void {}

  saveActiveTree(): void {
    this.command.saveActiveTree();
  }

  loadTree(): void {
    this.command.reloadTree();
  }

  clearTree(): void {
    this.command.clearTree();
  }
}
