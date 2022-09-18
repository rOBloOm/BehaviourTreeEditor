import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { NodeManagerService } from '../../services/node-manager.service';

@Component({
  selector: 'sp-editor-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent implements OnInit {
  constructor(private manager: NodeManagerService) {}

  ngOnInit(): void {}

  printTree(): void {
    console.log(this.manager.nodes);
  }
}
