import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { TreeStoreService } from '../../data/services/tree-store.service';
import { NodePanel } from '../components/left-panel/left-panel.component';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CanvasManagerService } from '../drawing/systems/canvas-manager.service';
import { CanvasMouseService } from '../drawing/systems/canvas-mouse.service';
import { CanvasSelectionService } from '../drawing/systems/canvas-selection.service';
import { CanvasService } from '../drawing/systems/canvas.service';
import { LoaderService } from './loader.service';

@Injectable()
export class CommandService {
  openTreePanelSubject = new Subject<NodePanel>();
  openTreePanel$ = this.openTreePanelSubject.asObservable();

  constructor(
    private canvas: CanvasService,
    private canvasManager: CanvasManagerService,
    private canvasMouse: CanvasMouseService,
    private canvasSelection: CanvasSelectionService,
    private treeStore: TreeStoreService,
    private projectStore: ProjectStoreService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) {}

  saveActiveTree(): void {
    const root = this.canvasManager.currentRoot;
    if (root.identifier === '') {
      this.treeStore.add(root).subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        next: (root) => {
          const project = this.projectStore.active;
          this.projectStore.updateProject(project);
          this.canvasManager.currentRoot.identifier = root.identifier;
          this.toastr.success('Tree has been saved');
        },
      });
    } else {
      this.treeStore.update(root).subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        complete: () => this.toastr.success('Tree has been saved'),
      });
    }
  }

  openPanel(panel: NodePanel): void {
    this.openTreePanelSubject.next(panel);
  }

  reloadTree(): void {
    if (!this.canvasManager.currentRoot) {
      this.toastr.error('No active tree');
      return;
    }
    this.treeStore
      .load(parseInt(this.canvasManager.currentRoot.identifier))
      .subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        next: (root) => {
          this.loader.import(root);
          this.toastr.success('Tree has been reloaded');
        },
      });
  }

  newTree(): void {
    this.canvasManager.initNewTree();
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

  addTreeWith(name: string): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    const pos = this.canvas.zui.clientToSurface(
      this.canvasMouse.mouseX,
      this.canvasMouse.mouseY
    );
    this.canvasManager.addTree(pos.x, pos.y, name);
  }

  deleteSelected(): void {
    if (!this.canvasMouse.isMouseInsideCanvas) return;

    if (this.canvasSelection.currentSelected !== undefined) {
      this.canvasManager.removeNode(this.canvasSelection.currentSelected.id);
    }
  }
}
