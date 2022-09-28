import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImportService } from '../../data/services/import.service';
import { StorageService } from '../../data/services/storage.service';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CanvasManagerService } from './canvas-manager.service';
import { CanvasService } from './canvas.service';
import { MouseInputService } from './mouse-input.service';
import { SelectionService } from './selection.service';

@Injectable()
export class CommandService {
  constructor(
    private canvas: CanvasService,
    private manager: CanvasManagerService,
    private mouse: MouseInputService,
    private storage: StorageService,
    private toastr: ToastrService,
    private importer: ImportService,
    private selection: SelectionService
  ) {}

  saveActiveTree(): void {
    const root = this.manager.currentRoot;
    if (root.identifier === '') {
      this.storage.add(root).subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        next: (root) => {
          this.toastr.success('Tree has been saved');
          this.storage.setActiveTree(root.identifier);
        },
      });
    } else {
      this.storage.update(root).subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        complete: () => this.toastr.success('Tree has been saved'),
      });
    }
  }

  loadTree(): void {
    // const tree = this.storage.load();
    // this.importer.import(tree);
    // this.toastr.success('Tree has been imported!', 'Import Action', {
    //   timeOut: 1500,
    //   positionClass: 'toast-bottom-right',
    // });
  }

  clearTree(): void {
    this.manager.clear();
  }

  addAction(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.mouse.mouseX,
      this.mouse.mouseY
    );
    this.manager.addActionNode(pos.x, pos.y, 'GetMeSomeAction', 'action01');
  }

  addCondition(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.mouse.mouseX,
      this.mouse.mouseY
    );
    this.manager.addConditionNode(pos.x, pos.y, 'IsItMoving?', 'condition01');
  }

  addSelector(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.mouse.mouseX,
      this.mouse.mouseY
    );
    this.manager.addCompositeNode(pos.x, pos.y, CompositeType.Selector);
  }

  addDecorator(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.mouse.mouseX,
      this.mouse.mouseY
    );
    this.manager.addDecorator(pos.x, pos.y, DecoratorType.Inverter);
  }

  addTree(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.mouse.mouseX,
      this.mouse.mouseY
    );
    this.manager.addTree(pos.x, pos.y, 'SomeOtherTree');
  }

  deleteSelected(): void {
    if (!this.mouse.isMouseInsideCanvas) return;

    if (this.selection.currentSelected !== undefined) {
      this.manager.removeNode(this.selection.currentSelected.id);
    }
  }
}
