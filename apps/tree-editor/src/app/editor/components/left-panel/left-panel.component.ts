import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommandService } from '../../services/command.service';
import { Destroy } from '../../../utils/components/destory';
import { Observable, takeUntil } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasDropData } from '../../drawing/models/canvas-drop-data.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { DecoratorType } from '../../drawing/enums/decorator-type.enum';
import { CompositeType } from '../../drawing/enums/composite-type.enum';
import { TreeStoreService } from '../../../data/services/tree-store.service';
import { SPNode } from '../../../data/models/sp-node.model';
import { EditorManagerService } from '../../services/editor-manager.service';

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

  trees$: Observable<SPNode[]>;

  constructor(
    private canvasManager: CanvasManagerService,
    private command: CommandService,
    private editorManager: EditorManagerService
  ) {
    super();
    this.trees$ = editorManager.activeProjectTrees$;
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

  public dragStartTree(event: DragEvent, tree: SPNode) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Tree],
      name: tree.displayName,
      identifier: tree.identifier,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartAction(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Action],
      name: item,
      identifier: item,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartCondition(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Condition],
      name: item,
      identifier: item,
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartDecorator(event: DragEvent, item: string) {
    const data = {
      nodeType: NodeGroupType[NodeGroupType.Decorator],
      nodeSubType: DecoratorType[item],
    } as CanvasDropData;

    event.dataTransfer.setData(CanvasDropData.NODE_DATA, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartComposite(event: DragEvent, item: string) {
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
