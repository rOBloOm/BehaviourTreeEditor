import { Injectable } from '@angular/core';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { NodeGroup } from '../drawing/node.group';
import { EditorSettings } from '../drawing/settings';
import { CanvasService } from './canvas.service';

@Injectable()
export class ShapeService {
  private get textStyle(): any {
    return {
      size: 18,
      weight: 400,
      leading: this.canvas.two.width * 0.08 * 0.8,
      family: 'Angus, Arial, sans-serif',
      alignment: 'center',
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      fill: EditorSettings.nodeSymbolColor,
    };
  }

  constructor(private canvas: CanvasService) {}

  createActionNode(x: number, y: number, text: string): NodeGroup {
    const actionText = this.canvas.two.makeText(text, x, y, this.textStyle);
    const textBoundsWidth = actionText.getBoundingClientRect().width;
    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      50,
      20
    );
    actionShape.fill = EditorSettings.nodeActionFillColor;
    actionShape.stroke = EditorSettings.nodeBorderColor;
    actionShape.linewidth = EditorSettings.nodeLineWith;
    const nodeGroup = this.canvas.two.makeGroup([actionShape, actionText]);
    return new NodeGroup(nodeGroup, actionShape, actionText);
  }

  createCompositeNode(x: number, y: number, text: string): NodeGroup {
    const actionText = this.canvas.two.makeText(
      '=> ' + text + ' =>',
      x,
      y,
      this.textStyle
    );
    const textBoundsWidth = actionText.getBoundingClientRect().width;
    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      50,
      20
    );
    actionShape.fill = EditorSettings.nodeCompositeFillColor;
    actionShape.stroke = EditorSettings.nodeBorderColor;
    actionShape.linewidth = EditorSettings.nodeLineWith;

    const nodeGroup = this.canvas.two.makeGroup([actionShape, actionText]);

    return new NodeGroup(nodeGroup, actionShape, actionText);
  }

  private getRectWidth(textBoundsWidth: number): number {
    if (textBoundsWidth < 40) return 40;
    if (textBoundsWidth < 700) return textBoundsWidth;
    return textBoundsWidth * 0.7;
  }
}
