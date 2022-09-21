import { HostListener, Injectable } from '@angular/core';
import { distinctUntilChanged, filter, switchMap, take, takeUntil } from 'rxjs';
import { Destroy } from '../../shared/components/destory';
import { InputService } from './input.service';
import { CanvasManagerService } from './canvas-manager.service';
import { SelectionService } from './selection.service';
import { CanvasService } from './canvas.service';
import Two from 'two.js';

@Injectable()
export class ShortcutService extends Destroy {
  private mouseX: number;
  private mouseY: number;

  constructor(
    private input: InputService,
    private manager: CanvasManagerService,
    private selection: SelectionService,
    private canvas: CanvasService
  ) {
    super();
  }

  init() {
    this.registerAddAction();
    this.registerAddSelector();
    this.registerDelete();
    this.trackMouse();
  }

  private registerDelete(): void {
    this.input.keyDown$
      .pipe(filter((keydown) => keydown.key === 'Delete'))
      .subscribe(() => {
        if (this.selection.currentSelected) {
          const id = this.selection.currentSelected.id;
          this.selection.deselectAll();
          this.manager.removeNode(id);
        }
      });
  }

  private registerAddAction(): void {
    this.input.keyDown$
      .pipe(filter((keydown) => keydown.key === 'a'))
      .subscribe((event) => {
        const pos = this.canvas.zui.clientToSurface(this.mouseX, this.mouseY);
        this.manager.addActionNode(pos.x, pos.y, 'AWholeNewNode');
      });
  }

  private registerAddSelector(): void {
    this.input.keyDown$
      .pipe(filter((keydown) => keydown.key === 's'))
      .subscribe((event) => {
        const pos = this.canvas.zui.clientToSurface(this.mouseX, this.mouseY);
        this.manager.addCompositeNode(pos.x, pos.y, 'Selector');
      });
  }

  private trackMouse(): void {
    this.input.mouseMove$.pipe(takeUntil(this.destroy$)).subscribe((mouse) => {
      this.mouseX = mouse.x;
      this.mouseY = mouse.y;
    });
  }
}
