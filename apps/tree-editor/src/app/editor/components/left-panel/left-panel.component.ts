import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'sp-editor-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent implements OnInit {
  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {}

  printTree(): void {
    console.log(this.cameraService.two.scene.children);
  }
}
