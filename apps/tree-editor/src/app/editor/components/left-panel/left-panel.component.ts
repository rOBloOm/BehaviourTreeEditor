import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'sp-editor-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent implements OnInit {
  constructor(private canvasService: CanvasService) {}

  ngOnInit(): void {}

  printTree(): void {
    console.log(this.canvasService.two.scene.children);
  }
}
