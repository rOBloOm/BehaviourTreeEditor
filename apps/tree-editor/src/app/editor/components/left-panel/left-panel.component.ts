import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommandService } from '../../services/command.service';
import { Destroy } from '../../../utils/components/destory';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  from,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasDropData } from '../../drawing/models/canvas-drop-data.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { DecoratorType } from '../../drawing/enums/decorator-type.enum';
import { CompositeType } from '../../drawing/enums/composite-type.enum';
import { SPNode } from '../../../data/models/sp-node.model';
import { EditorManagerService } from '../../services/editor-manager.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteTreeDialogComponent } from '../delete-tree-dialog/delete-tree-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SPLeafNode } from '../../../data/models/sp-leaf-node.model';
import { LeafNodeStoreService } from '../../../data/services/leaf-node-store.service';

@Component({
  selector: 'sp-editor-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent
  extends Destroy
  implements OnInit, AfterViewInit
{
  @ViewChild('accordion')
  accordion: NgbAccordion;

  composites: string[] = [
    'Selector',
    'PrioritySelector',
    'RandomSelector',
    'Sequence',
    'PrioritySequence',
    'RandomSequence',
    'SimpleParallel',
  ];

  decorators: string[] = [
    'Failer',
    'AutoReset',
    'Cooldown',
    'Inverter',
    'Random',
    'RateLimiter',
    'Repeat',
    'Succeeder',
    'TimeLimit',
    'UntilFailed',
    'UntilSuccess',
  ];

  filteredTrees$: Observable<SPNode[]>;
  filteredDecorators$: Observable<string[]>;
  filteredComposites$: Observable<string[]>;

  private actionsSubject = new BehaviorSubject<SPLeafNode[]>([]);
  filteredActions$: Observable<SPLeafNode[]>;

  private conditionsSubject = new BehaviorSubject<SPLeafNode[]>([]);
  filteredConditions$: Observable<SPLeafNode[]>;

  form = new FormGroup({
    treeSearch: new FormControl<string>(''),
    decoratorSearch: new FormControl<string>(''),
    compositeSearch: new FormControl<string>(''),
    actionSearch: new FormControl<string>(''),
    conditionSearch: new FormControl<string>(''),
  });

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private command: CommandService,
    private editorManager: EditorManagerService,
    private leafNodeStore: LeafNodeStoreService
  ) {
    super();

    this.initTrees();
    this.initDecorators();
    this.initActions();
    this.initConditions();
  }

  ngAfterViewInit(): void {
    this.accordion.expand(NodePanel.AccTree);
  }

  ngOnInit(): void {
    this.command.openTreePanel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((panel: NodePanel) => {
        this.accordion.expand(panel);
      });
  }

  setActive(identifier: string): void {
    this.editorManager.setActiveTree(identifier);
  }

  addTree(): void {
    this.command.newTree();
  }

  deleteTree(tree: SPNode): void {
    const dialog = this.modalService.open(DeleteTreeDialogComponent, {
      centered: true,
    });
    dialog.componentInstance.name = tree.displayName;
    dialog.componentInstance.isEdit = true;

    from(dialog.result)
      .pipe(
        first(),
        filter((result) => result && result.delete),
        switchMap(() => this.editorManager.deleteTree(tree.identifier))
      )
      .subscribe({
        error: () => this.toastr.error('Error deleting tree'),
        next: () => this.toastr.success('Tree deleted'),
      });
  }

  isRootTree$(identifier: string): Observable<boolean> {
    return this.editorManager.isRootTree$(identifier).pipe(shareReplay());
  }

  treeItemClass$(identifier: string): Observable<string> {
    return combineLatest([
      this.editorManager.isRootTree$(identifier),
      this.editorManager.isActiveTree$(identifier),
    ]).pipe(
      map(([isRoot, isActive]) => {
        if (isActive && isRoot) return 'active-tree-item root-tree-item';

        return isActive
          ? 'active-tree-item'
          : isRoot
          ? 'root-tree-item'
          : 'tree-item';
      })
    );
  }

  dragStartTree(event: DragEvent, tree: SPNode) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Tree],
      name: tree.displayName,
      identifier: tree.identifier,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  dragStartAction(event: DragEvent, item: SPLeafNode) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Action],
      name: item.displayName,
      identifier: item.identifier,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  dragStartCondition(event: DragEvent, item: SPLeafNode) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Condition],
      name: item.displayName,
      identifier: item.identifier,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  dragStartDecorator(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Decorator],
      nodeSubType: DecoratorType[item],
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  dragStartComposite(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Composite],
      nodeSubType: CompositeType[item],
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  private initTrees(): void {
    this.filteredTrees$ = combineLatest([
      this.editorManager.activeProjectTrees$,
      this.form.controls.treeSearch.valueChanges.pipe(
        startWith(this.form.controls.treeSearch.value)
      ),
    ]).pipe(
      takeUntil(this.destroy$),
      map(([trees, search]) => {
        return search.length > 0
          ? trees.filter((tree) =>
              tree.displayName.toLowerCase().includes(search.toLowerCase())
            )
          : trees;
      })
    );
  }
  private initDecorators(): void {
    this.filteredDecorators$ =
      this.form.controls.decoratorSearch.valueChanges.pipe(
        takeUntil(this.destroy$),
        startWith(this.form.controls.decoratorSearch.value),
        map((search) => {
          return search.length > 0
            ? this.decorators.filter((decorator) =>
                decorator.toLowerCase().includes(search.toLowerCase())
              )
            : this.decorators;
        })
      );
  }

  private initActions(): void {
    this.leafNodeStore
      .getActions$()
      .pipe(first())
      .subscribe((actions) => this.actionsSubject.next(actions));

    this.filteredActions$ = combineLatest([
      this.actionsSubject,
      this.form.controls.actionSearch.valueChanges.pipe(
        startWith(this.form.controls.actionSearch.value)
      ),
    ]).pipe(
      takeUntil(this.destroy$),
      map(([actions, search]) => {
        return search.length > 0
          ? actions.filter((action) =>
              action.displayName
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            )
          : actions;
      })
    );
  }

  private initConditions(): void {
    this.leafNodeStore
      .getConditions$()
      .pipe(first())
      .subscribe((conditions) => this.conditionsSubject.next(conditions));

    this.filteredConditions$ = combineLatest([
      this.conditionsSubject,
      this.form.controls.conditionSearch.valueChanges.pipe(
        startWith(this.form.controls.conditionSearch.value)
      ),
    ]).pipe(
      takeUntil(this.destroy$),
      map(([conditions, search]) => {
        return search.length > 0
          ? conditions.filter((action) =>
              action.displayName
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            )
          : conditions;
      })
    );
  }
}

export enum NodePanel {
  AccTree = 'acc-trees',
  AccAction = 'acc-actions',
  AccCondition = 'acc-conditions',
  AccDecorator = 'acc-decorators',
  AccComposite = 'acc-composites',
}
