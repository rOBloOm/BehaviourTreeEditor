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
import { TreeExportSerive } from './tree-export.service';
import { TreeImportService } from './tree-import.service';

@Injectable()
export class EditorManagerService extends Destroy {
  activeProject$: Observable<SPProject>;

  private activeProjectTreesSubject = new BehaviorSubject<SPNode[]>([]);
  activeProjectTrees$ = this.activeProjectTreesSubject.asObservable();

  private activeProjectTreesChangedSubject = new Subject<boolean>();
  activeProjectTreesChanged$ =
    this.activeProjectTreesChangedSubject.asObservable();

  private activeTreeSubject = new BehaviorSubject<SPNode | undefined>(
    undefined
  );
  acitveTree$ = this.activeTreeSubject.asObservable();

  constructor(
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService,
    private exportService: TreeExportSerive,
    private importService: TreeImportService
  ) {
    super();

    //Get the active project
    this.activeProject$ = this.projectStore
      .loadActiveProject()
      .pipe(shareReplay());

    //initially load tree from active project which will never change during the lifecyle of this service
    this.activeProject$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((project) => this.treeStore.getAllByProjectId(project.id))
      )
      .subscribe((trees) => this.activeProjectTreesSubject.next(trees));

    //fire trees subject if tree gets added or updated
    this.activeProjectTreesChangedSubject
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.activeProject$),
        switchMap((project) => {
          if (project) {
            return combineLatest([
              of(project),
              this.treeStore.getAllByProjectId(project.id),
            ]);
          } else {
            return combineLatest([of(project), of([]) as Observable<SPNode[]>]);
          }
        })
      )
      .subscribe(([project, trees]) => {
        const rootTree = trees.find(
          (tree) => tree.identifier === project.rootNodeId.toString()
        );
        this.activeTreeSubject.next(rootTree);
        this.activeProjectTreesSubject.next(trees);
      });
  }

  init() {
    this.activeProject$.pipe(first()).subscribe((project) => {
      this.setActiveTree(project.rootNodeId);
    });
  }

  addTree(root: NodeGroup): Observable<number> {
    const node = this.exportService.export(root);
    return this.activeProject$.pipe(
      first(),
      tap((project) => (node.projectId = project.id)),
      switchMap(() => this.treeStore.add(node)),
      switchMap((node) => of(parseInt(node.identifier))),
      tap(() => this.activeProjectTreesChangedSubject.next(true))
    );
  }

  updateTree(root: NodeGroup): Observable<boolean> {
    const node = this.exportService.export(root);
    return this.activeProject$.pipe(
      first(),
      tap((project) => (node.projectId = project.id)),
      switchMap(() => this.treeStore.update(node)),
      tap(() => this.activeProjectTreesChangedSubject.next(true)),
      switchMap(() => of(true))
    );
  }

  setActiveTree(id: number) {
    combineLatest([this.activeProject$, this.activeProjectTrees$])
      .pipe(filter(([project]) => project !== undefined))
      .subscribe(([, trees]) => {
        if (trees.length === 0) return;

        const tree = trees.find((tree) => tree.identifier == id.toString());
        this.importService.import(tree);
        this.activeTreeSubject.next(tree);
      });
  }
}
