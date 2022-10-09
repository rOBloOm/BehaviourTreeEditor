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
  combineLatest,
  filter,
  first,
  from,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasDropData } from '../../drawing/models/canvas-drop-data.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { DecoratorType } from '../../drawing/enums/decorator-type.enum';
import { CompositeType } from '../../drawing/enums/composite-type.enum';
import { TreeStoreService } from '../../../data/services/tree-store.service';
import { SPNode } from '../../../data/models/sp-node.model';
import { EditorManagerService } from '../../services/editor-manager.service';
import { DefaultFlexOffsetDirective } from '@angular/flex-layout';
import { ToastrService } from 'ngx-toastr';
import { DeleteTreeDialogComponent } from '../delete-tree-dialog/delete-tree-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';

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

  actions: string[] = [
    'action01',
    'doSomeCoolStuff',
    'BotherAboutSomething',
    'PickUpAnItem',
    'TryHarder',
  ];

  conditions: string[] = [
    'IsItBlue',
    'CheckHealth',
    'IsAlive',
    'IsBothered',
    'IsWet',
    'IsHappy',
    'IsAngry',
  ];

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

  form = new FormGroup({
    treeSearch: new FormControl<string>(''),
    decoratorSearch: new FormControl<string>(''),
    compositeSearch: new FormControl<string>(''),
  });

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private canvasManager: CanvasManagerService,
    private command: CommandService,
    private editorManager: EditorManagerService
  ) {
    super();

    this.filteredTrees$ = combineLatest([
      editorManager.activeProjectTrees$,
      this.form.controls.treeSearch.valueChanges.pipe(startWith('')),
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

    this.filteredDecorators$ =
      this.form.controls.decoratorSearch.valueChanges.pipe(
        startWith(''),
        map((search) => {
          return search.length > 0
            ? this.decorators.filter((decorator) =>
                decorator.toLowerCase().includes(search.toLowerCase())
              )
            : this.decorators;
        })
      );
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

  printTree(): void {
    console.log(this.canvasManager.nodes);
  }

  setActive(treeId: string): void {
    this.editorManager.setActiveTree(parseInt(treeId));
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
        switchMap(() =>
          this.editorManager.deleteTree(parseInt(tree.identifier))
        )
      )
      .subscribe({
        error: () => this.toastr.error('Error deleting tree'),
        next: () => this.toastr.success('Tree deleted'),
      });
  }

  isRootTree$(identifier: string): Observable<boolean> {
    return this.editorManager
      .isRootTree$(parseInt(identifier))
      .pipe(shareReplay());
  }

  treeItemClass$(identifier: string): Observable<string> {
    return combineLatest([
      this.editorManager.isRootTree$(parseInt(identifier)),
      this.editorManager.isActiveTree$(parseInt(identifier)),
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

  dragStartAction(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Action],
      name: item,
      identifier: item,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  dragStartCondition(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Condition],
      name: item,
      identifier: item,
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
}

export enum NodePanel {
  AccTree = 'acc-trees',
  AccAction = 'acc-actions',
  AccCondition = 'acc-conditions',
  AccDecorator = 'acc-decorators',
  AccComposite = 'acc-composites',
}
