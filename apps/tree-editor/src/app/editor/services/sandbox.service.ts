import { Injectable } from '@angular/core';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { SettingsProviderService } from '../../shared/services/settings-provider.service';
import { ShapeService } from './shape.service';

@Injectable()
export class SandboxService {
  constructor(
    private settings: SettingsProviderService,
    private shapeService: ShapeService
  ) {}

  attach(two: Two, zui: ZUI): void {
    const x = two.width * 0.5;
    const y = two.height * 0.5;
    const width = 50;
    const height = 50;

    // var rect1 = makeRect2(two, x, y, width, height, 10);
    // rect1.fill = this.settings.bgBaseColor;

    // var rect2 = makeRect2(two, x + 100, y, width, height, 10);

    // two.makeGroup(rect1, rect2);

    this.shapeService.createActionShape(x, y, 'some action');

    this.shapeService.createActionShape(
      x,
      y - 200,
      'some really long ass action'
    );

    this.shapeService.createActionShape(
      x,
      y + 100,
      'some really long actionklasdjflkjas dfjasldkjflkasjdfl kjasd'
    );

    //two.makeCircle(100, 40, 10);
  }
}
