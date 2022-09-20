import { Injectable } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs';
import { Destroy } from '../../shared/components/destory';
import { InputService } from './input.service';
import { CanvasManagerService } from './canvas-manager.service';
import { SelectionService } from './selection.service';

@Injectable()
export class ShortcutService extends Destroy {
  constructor(
    private input: InputService,
    private manager: CanvasManagerService,
    private selection: SelectionService
  ) {
    super();
  }

  init() {
    this.registerDelete();
  }

  private registerDelete(): void {
    this.input.keyDown$
      .pipe(
        takeUntil(this.destroy$),
        filter((keyDown) => keyDown.key === 'Delete'),
        switchMap(() => this.selection.selected$),
        filter((selected) => selected !== undefined)
      )
      .subscribe((selected) => {
        this.selection.deselectAll();
        this.manager.removeNode(selected.id);
      });
  }
}
