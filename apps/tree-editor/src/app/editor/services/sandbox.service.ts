import { Injectable } from '@angular/core';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { CanvasService } from './canvas.service';
import { CanvasManagerService } from './canvas-manager.service';

@Injectable()
export class SandboxService {
  constructor(
    private manager: CanvasManagerService,
    private canvas: CanvasService
  ) {}

  init(): void {
    const x = this.canvas.two.width * 0.5;
    const y = this.canvas.two.height * 0.5;
    const width = 50;
    const height = 50;

    this.manager.addActionNode(x, y + 100, 'DoYourWorkOnPushingButtons');

    this.manager.addCompositeNode(x - 200, y - 100, 'PrioritySelector');

    this.manager.addCompositeNode(x + 100, y - 100, 'Selector');
  }
}
