import { Component, ElementRef, OnInit } from '@angular/core';
import Two from 'two.js';
import { makeRect2 } from '../../drawing/shapes';
import { CameraService } from '../../services/camera.service';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'sweet-potato-node-panel-two',
  templateUrl: './nodes-panel.component.html',
  styleUrls: ['./nodes-panel.component.scss'],
})
export class NodesPanelComponent implements OnInit {
  constructor(
    camera: CameraService,
    drag: DragService,
    domElement: ElementRef
  ) {
    const two = new Two({
      type: Two.Types.canvas,
      fullscreen: true,
      autostart: true,
    }).appendTo(domElement.nativeElement);

    camera.attach(two);

    const x = two.width * 0.5;
    const y = two.height * 0.5;
    const width = 50;
    const height = 50;

    var rect1 = makeRect2(two, x, y, width, height, 10);
    rect1.on('mousedown', mouseDownR1);

    var rect2 = makeRect2(two, x + 100, y, width, height, 10);
    rect2.on('mousedown', mouseDownR2);

    function mouseDownR1(e) {
      console.log('r1');
    }

    function mouseDownR2(e) {
      console.log('r2');
    }

    two.makeCircle(100, 40, 10);

    //two.makeGroup(two.makeCircle(100, 200, 10));

    drag.attach(two);

    // const rect = two.makeRectangle(x, y, width, height);

    // two.bind('update', rotate);

    // function rotate() {
    //   rect.rotation += 0.1;
    // }
  }

  ngOnInit(): void {}
}
