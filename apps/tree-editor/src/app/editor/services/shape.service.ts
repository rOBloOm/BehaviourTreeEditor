import { Injectable } from '@angular/core';
import { Path } from 'two.js/src/path';
import { SPGroup } from '../../shared/models/sp-group.model';
import { SettingsProviderService } from '../../shared/services/settings-provider.service';
import { CanvasService } from './canvas.service';

@Injectable()
export class ShapeService {
  constructor(
    private settings: SettingsProviderService,
    private canvas: CanvasService
  ) {}

  createActionShape(x: number, y: number, text: string): Path {
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
    const width = actionText.getBoundingClientRect().width;

    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      width,
      50,
      20
    );
    actionShape.stroke = this.settings.nodeBorderColor;
    actionShape.fill = this.settings.nodeActionFillColor;

    var group = this.canvas.two.makeGroup([actionShape, actionText]) as SPGroup;
    group.myid = 'some my id';

    return actionShape;
  }
}
