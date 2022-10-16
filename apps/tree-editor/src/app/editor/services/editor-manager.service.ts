import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SPNode } from '../../store/models/sp-node.model';
import { SPProject } from '../../store/models/sp-project.model';
import { ProjectStoreService } from '../../store/services/project-store.service';
import { TreeStoreService } from '../../store/services/tree-store.service';
import { Destroy } from '../../base/components/destory';
import { NodeGroupType } from '../drawing/enums/node-group-type.enum';
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
        this.setActiveTree(project.rootNodeIdentifier);
      });

    //Reset selection if tree changes
    this.acitveTree$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => selection.deselectAll());

    //Register tree navigation with doubleclick on node
    selection.doubleClicked$
      .pipe(
        takeUntil(this.destroy$),
        filter((node) => node !== undefined),
        filter((node) => node.nodeType === NodeGroupType.Tree)
      )
      .subscribe((node) => this.setActiveTree(node.identifier));
  }

  addTree(root: NodeGroup): Observable<string> {
    const node = this.exportService.export(root);
    const identifier = crypto.randomUUID();
    return this.activeProject$.pipe(
      first(),
      tap((project) => {
        node.projectId = project.id;
        node.identifier = identifier;
      }),
      switchMap(() => this.treeStore.add(node)),
      switchMap((node) => of(node.identifier)),
      switchMap((identifier) =>
        combineLatest([of(identifier), this.reloadTrees()])
      ),
      map(([identifier]) => identifier)
    );
  }

  updateTree(root: NodeGroup): Observable<boolean> {
    const node = this.exportService.export(root);
    node.id = this.activeTreeSubject.value.id;

    return this.activeProject$.pipe(
      first(),
      tap((project) => (node.projectId = project.id)),
      switchMap(() => this.treeStore.update(node)),
      switchMap(() => this.reloadTrees()),
      switchMap(() => of(true))
    );
  }

  deleteTree(identifier: string): Observable<boolean> {
    return this.treeStore.deleteByIdentifier(identifier).pipe(
      switchMap(() => this.reloadTrees()),
      switchMap(() => this.isActiveTree$(identifier).pipe(first())),
      tap((isActive) => {
        if (isActive) this.canvas.clear();
        this.setActiveTree(this.activeProjectSubject.value.rootNodeIdentifier);
      }),
      switchMap(() => of(true))
    );
  }

  setActiveTree(identifier: string) {
    combineLatest([this.activeProject$, this.activeProjectTrees$])
      .pipe(
        first(),
        filter(([project]) => project !== undefined)
      )
      .subscribe(([, trees]) => {
        if (trees.length === 0) return;

        const tree = trees.find((tree) => tree.identifier === identifier);
        this.importService.import(tree, trees);
        this.activeTreeSubject.next(tree);
      });
  }

  isRootTree$(identifier: string): Observable<boolean> {
    return this.activeProject$.pipe(
      map((project) => project.rootNodeIdentifier === identifier)
    );
  }

  isActiveTree$(identifier: string): Observable<boolean> {
    return this.acitveTree$.pipe(
      map((tree) => tree?.identifier === identifier ?? false)
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
