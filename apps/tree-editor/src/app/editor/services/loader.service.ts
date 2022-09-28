import { Injectable } from '@angular/core';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { CanvasService } from './canvas.service';
import { CanvasManagerService } from './canvas-manager.service';
import { DrawingService } from '../drawing/drawing.service';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { StorageService } from '../../data/services/storage.service';
import { ImportService } from '../../data/services/import.service';

@Injectable()
export class LoaderService {
  constructor(
    private manager: CanvasManagerService,
    private canvas: CanvasService,
    private storage: StorageService,
    private importer: ImportService
  ) {}

  init(): void {
    const x = this.canvas.two.width * 0.5;
    const y = this.canvas.two.height * 0.2;

    const treeId = this.storage.getActiveTree();
    if (treeId) {
      this.storage.load(treeId).subscribe((root) => {
        this.importer.import(root);
      });
    } else {
      this.manager.addRootNode(x, y, '', 'NewTree');
    }
  }
}
