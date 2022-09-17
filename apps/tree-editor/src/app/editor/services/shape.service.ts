import { Injectable } from '@angular/core';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { SettingsProviderService } from '../../shared/services/settings-provider.service';
import { CanvasService } from './canvas.service';

@Injectable()
export class ShapeService {
  constructor(
    private settings: SettingsProviderService,
    private canvas: CanvasService
  ) {}

  createActionShape(x: number, y: number, text: string): Group {
    var defaultStyles = {
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
      fill: this.settings.nodeSymbolColor,
    };

    const actionText = this.canvas.two.makeText(text, x, y, defaultStyles);
    const textBoundsWidth = actionText.getBoundingClientRect().width;
    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      50,
      20
    );
    actionShape.stroke = this.settings.nodeBorderColor;
    actionShape.fill = this.settings.nodeActionFillColor;

    let shadow = this.canvas.two.makeRoundedRectangle(
      actionShape.position.x,
      actionShape.position.y,
      actionShape.width + 7,
      actionShape.height + 7,
      20
    ) as Rectangle;

    shadow.noStroke();
    shadow.fill = '#34c9fa';
    shadow.opacity = 0.5;

    return this.canvas.two.makeGroup([shadow, actionShape, actionText]);
  }

  private getRectWidth(textBoundsWidth: number): number {
    if (textBoundsWidth < 40) return 40;
    if (textBoundsWidth < 700) return textBoundsWidth;
    return textBoundsWidth * 0.7;
  }
}
