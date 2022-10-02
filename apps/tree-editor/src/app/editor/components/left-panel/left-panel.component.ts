import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommandService } from '../../services/command.service';
import { Destroy } from '../../../utils/components/destory';
import { takeUntil } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';

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

  trees: string[] = [
    'Tresade1',
    '-.,ölkölköl',
    'asdfasd',
    'asdfasdfasdfasd',
    'Tree1',
    'Trfasdfasdfee1',
    'Tree1',
    'Tsadfasdfree1',
    'Tree1',
    'Treeasdfaas1',
    'Tree1',
    'kjaslkdjf',
    'Tree1',
    'Tree1',
    'Tree1',
    'Treeasdfaas1',
    'Tree1',
    'kjaslkdjf',
    'Tree1',
    'Tree1',
  ];

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

  constructor(
    private canvasManager: CanvasManagerService,
    private command: CommandService
  ) {
    super();
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

  public dragStartTree(event: DragEvent, item: string) {
    event.dataTransfer.setData('id', item);
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartAction(event: DragEvent, item: string) {
    event.dataTransfer.setData('id', item);
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartCondition(event: DragEvent, item: string) {
    event.dataTransfer.setData('id', item);
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartDecorator(event: DragEvent, item: string) {
    event.dataTransfer.setData('id', item);
    event.dataTransfer.effectAllowed = 'move';
  }

  public dragStartComposite(event: DragEvent, item: string) {
    event.dataTransfer.setData('id', item);
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
