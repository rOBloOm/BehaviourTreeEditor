import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'sp-editor-menu-bar',
  templateUrl: './editor-menu-bar.component.html',
  styleUrls: ['./editor-menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorMenuBarComponent implements OnInit {
  constructor(
    private command: CommandService,
    private manager: CanvasManagerService
  ) {}

  ngOnInit(): void {}

  get treeName$(): Observable<string> {
    return this.manager.rootIdentifier$;
  }

  saveActiveTree(): void {
    this.command.saveActiveTree();
  }

  loadTree(): void {
    this.command.loadTree();
  }

  clearTree(): void {
    this.command.clearTree();
  }
}
