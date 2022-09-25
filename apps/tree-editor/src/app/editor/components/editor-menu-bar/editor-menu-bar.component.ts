import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'sp-editor-menu-bar',
  templateUrl: './editor-menu-bar.component.html',
  styleUrls: ['./editor-menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorMenuBarComponent implements OnInit {
  constructor(private command: CommandService) {}

  ngOnInit(): void {}

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
