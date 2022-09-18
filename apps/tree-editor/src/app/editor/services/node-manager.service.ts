import { Injectable } from '@angular/core';
import { Destroy } from '../../shared/components/destory';
import { NodeGroup } from '../drawing/node.group';
import { CanvasService } from './canvas.service';
import { ShapeService } from './shape.service';

@Injectable()
export class NodeManagerService extends Destroy {
  nodes: { [name: string]: NodeGroup } = {};

  constructor(private shapes: ShapeService, private canvas: CanvasService) {
    super();
  }

  clear() {
    this.canvas.two.clear();
  }

  getTree(): void {}

  applyTree(): void {
    this.clear();
  }

  addCompositeNode(x: number, y: number, text: string): void {
    const node = this.shapes.createCompositeNode(x, y, text);
    this.nodes[node.id] = node;
  }

  addActionNode(x: number, y: number, text: string): void {
    const node = this.shapes.createActionNode(x, y, text);
    this.nodes[node.id] = node;
  }
}
