import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SPNode } from '../../data/models/sp-node.model';
import { SPProject } from '../../data/models/sp-project.model';
import { ProjectStoreService } from '../../data/services/project-store.service';
import { TreeStoreService } from '../../data/services/tree-store.service';
import { Destroy } from '../../utils/components/destory';
import { NodeGroup } from '../drawing/models/node-group.model';
import { CanvasManagerService } from '../drawing/systems/canvas-manager.service';
import { CanvasSelectionService } from '../drawing/systems/canvas-selection.service';
import { TreeExportSerive } from './tree-export.service';
import { TreeImportService } from './tree-import.service';

@Injectable()
export class EditorManagerService extends Destroy {
  private activeProjectSubject = new BehaviorSubject<SPProject | undefined>(
    undefined
  );
  activeProject$ = this.activeProjectSubject.asObservable();

  private activeProjectTreesSubject = new BehaviorSubject<SPNode[]>([]);
  activeProjectTrees$ = this.activeProjectTreesSubject.asObservable();

  private activeTreeSubject = new BehaviorSubject<SPNode | undefined>(
    undefined
  );
  acitveTree$ = this.activeTreeSubject.asObservable();

  constructor(
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService,
    private exportService: TreeExportSerive,
    private importService: TreeImportService,
    private canvas: CanvasManagerService,
    selection: CanvasSelectionService
  ) {
    super();

    this.projectStore
      .loadActiveProject()
      .pipe(
        switchMap((project) =>
          combineLatest([
            of(project),
            this.treeStore.getAllByProjectId(project.id),
          ])
        ),
        first()
      )
      .subscribe(([project, trees]) => {
        this.activeProjectTreesSubject.next(trees);
        this.activeProjectSubject.next(project);
        this.setActiveTree(project.rootNodeId);
      });

    //Reset selection if tree changes
    this.acitveTree$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => selection.deselectAll());
  }

  addTree(root: NodeGroup): Observable<number> {
    const node = this.exportService.export(root);
    return this.activeProject$.pipe(
      first(),
      tap((project) => (node.projectId = project.id)),
      switchMap(() => this.treeStore.add(node)),
      switchMap((node) => of(parseInt(node.identifier))),
      switchMap((identifier) =>
        combineLatest([of(identifier), this.reloadTrees()])
      ),
      map(([identifier]) => identifier)
    );
  }

  updateTree(root: NodeGroup): Observable<boolean> {
    const node = this.exportService.export(root);
    return this.activeProject$.pipe(
      first(),
      tap((project) => (node.projectId = project.id)),
      switchMap(() => this.treeStore.update(node)),
      switchMap(() => this.reloadTrees()),
      switchMap(() => of(true))
    );
  }

  deleteTree(id: number): Observable<boolean> {
    return this.treeStore.delete(id).pipe(
      switchMap(() => this.reloadTrees()),
      switchMap(() => this.isActiveTree$(id).pipe(first())),
      tap((isActive) => {
        if (isActive) this.canvas.clear();
        this.setActiveTree(this.activeProjectSubject.value.rootNodeId);
      }),
      switchMap(() => of(true))
    );
  }

  setActiveTree(id: number) {
    combineLatest([this.activeProject$, this.activeProjectTrees$])
      .pipe(
        first(),
        filter(([project]) => project !== undefined)
      )
      .subscribe(([, trees]) => {
        if (trees.length === 0) return;

        const tree = trees.find((tree) => tree.identifier == id.toString());
        this.importService.import(tree);
        this.activeTreeSubject.next(tree);
      });
  }

  isRootTree$(id: number): Observable<boolean> {
    return this.activeProject$.pipe(
      map((project) => project.rootNodeId === id)
    );
  }

  isActiveTree$(id: number): Observable<boolean> {
    return this.acitveTree$.pipe(
      map((tree) => tree?.identifier == id.toString() ?? false)
    );
  }

  private reloadTrees(): Observable<SPNode[]> {
    return this.treeStore
      .getAllByProjectId(this.activeProjectSubject.value.id)
      .pipe(
        first(),
        tap((trees) => this.activeProjectTreesSubject.next(trees))
      );
  }
}
