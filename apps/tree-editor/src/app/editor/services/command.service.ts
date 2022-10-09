import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, switchMap, tap } from 'rxjs';
import { NodePanel } from '../components/left-panel/left-panel.component';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CanvasManagerService } from '../drawing/systems/canvas-manager.service';
import { CanvasMouseService } from '../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../drawing/systems/canvas-selection.service';
import { CanvasService } from '../drawing/systems/canvas.service';
import { EditorManagerService } from './editor-manager.service';

@Injectable()
export class CommandService {
  openTreePanelSubject = new Subject<NodePanel>();
  openTreePanel$ = this.openTreePanelSubject.asObservable();

  constructor(
    private canvas: CanvasService,
    private canvasManager: CanvasManagerService,
    private canvasMouse: CanvasMouseService,
    private canvasSelection: CanvasSelectionService,
    private editorManager: EditorManagerService,
    private toastr: ToastrService
  ) {}

  saveActiveTree(): void {
    const root = this.canvasManager.currentRoot;
    this.editorManager
      .updateTree(root)
      .pipe(
        tap(() => {
          const activeElement = document.activeElement as HTMLInputElement;
          activeElement?.blur();
        })
      )
      .subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        complete: () => this.toastr.success('Tree has been saved'),
      });
  }

  openPanel(panel: NodePanel): void {
    this.openTreePanelSubject.next(panel);
  }

  newTree(): void {
    const root = this.canvasManager.initNewTree();
    this.editorManager
      .addTree(root)
      .pipe(first())
      .subscribe((treeId) => {
        this.editorManager.setActiveTree(treeId);
        this.toastr.success('tree added');
      });
  }

  addActionWith(identifier: string, name: string): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addActionNode(pos.x, pos.y, identifier, name);
  }

  addConditionWith(identifier: string, name: string): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addConditionNode(pos.x, pos.y, identifier, name);
  }

  addCompositeWith(type: CompositeType): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addCompositeNode(pos.x, pos.y, type);
  }

  addDecoratorWith(type: DecoratorType): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addDecorator(pos.x, pos.y, type);
  }

  addTreeWith(identifier: string, name: string): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addTree(pos.x, pos.y, identifier, name);
  }

  deleteSelected(): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    if (this.canvasSelection.currentSelected !== undefined) {
      this.canvasManager.removeNode(this.canvasSelection.currentSelected.id);
    }
  }
}
