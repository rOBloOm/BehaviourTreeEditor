import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { CommandService } from '../../services/command.service';
import { Destroy } from '../../../utils/components/destory';
import { takeUntil } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sp-editor-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent extends Destroy implements OnInit {
  @ViewChild('accordion')
  accordion: NgbAccordion;

  constructor(
    private manager: CanvasManagerService,
    private command: CommandService
  ) {
    super();
  }

  ngOnInit(): void {
    this.command.openTreePanel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((panel: NodePanel) => {
        this.accordion.expand(panel);
      });
  }

  printTree(): void {
    console.log(this.manager.nodes);
  }
}

export enum NodePanel {
  AccTree = 'acc-trees',
  AccAction = 'acc-actions',
  AccCondition = 'acc-conditions',
}
