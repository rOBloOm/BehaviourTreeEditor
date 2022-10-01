import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { TreeStoreService } from '../../data/services/tree-store.service';
import { NodePanel } from '../components/left-panel/left-panel.component';
import { CompositeType } from '../drawing/enums/composite-type.enum';
import { DecoratorType } from '../drawing/enums/decorator-type.enum';
import { CanvasManagerService } from './canvas-manager.service';
import { CanvasService } from './canvas.service';
import { LoaderService } from './loader.service';
import { MouseInputService } from './mouse-input.service';
import { SelectionService } from './selection.service';

@Injectable()
export class CommandService {
  openTreePanelSubject = new Subject<NodePanel>();
  openTreePanel$ = this.openTreePanelSubject.asObservable();

  constructor(
    private canvas: CanvasService,
    private manager: CanvasManagerService,
    private mouse: MouseInputService,
    private treeStore: TreeStoreService,
    private projectStore: ProjectStoreService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private selection: SelectionService
  ) {}

  saveActiveTree(): void {
    const root = this.manager.currentRoot;
    if (root.identifier === '') {
      this.treeStore.add(root).subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        next: (root) => {
          const project = this.projectStore.active;
          project.rootNodeId = parseInt(root.identifier);
          this.projectStore.updateProject(project);
          this.manager.currentRoot.identifier = root.identifier;
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
    if (!this.manager.currentRoot) {
      this.toastr.error('No active tree');
      return;
    }
    this.treeStore
      .load(parseInt(this.manager.currentRoot.identifier))
      .subscribe({
        error: (err) => this.toastr.error('Error saving tree'),
        next: (root) => {
          this.loader.import(root);
          this.toastr.success('Tree has been reloaded');
        },
      });
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
