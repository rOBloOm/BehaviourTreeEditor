import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Destroy } from '../../../utils/components/destory';
import { CommandService } from '../../services/command.service';
import { CompositeType } from '../enums/composite-type.enum';
import { DecoratorType } from '../enums/decorator-type.enum';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { CanvasDropData } from '../models/canvas-drop-data.model';
import { CanvasMouseService } from './canvas-mouse.service';

@Injectable()
export class CanvasDropService extends Destroy {
  constructor(
    private canvasMouse: CanvasMouseService,
    private command: CommandService
  ) {
    super();
  }

  init(): void {
    this.initDragDropBehaviour();
  }

  private initDragDropBehaviour(): void {
    this.canvasMouse.drag$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      event.preventDefault();
    });

    this.canvasMouse.drop$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      const data = event.dataTransfer.getData(CanvasDropData.NODE_DATA);
      if (!data && data.length <= 0) return;

      const dropData = JSON.parse(data) as CanvasDropData;
      if (dropData) {
        switch (dropData.nodeType) {
          case NodeGroupType[NodeGroupType.Tree]:
            this.command.addTreeWith(dropData.identifier);
            break;
          case NodeGroupType[NodeGroupType.Action]:
            this.command.addActionWith(dropData.identifier, dropData.name);
            break;
          case NodeGroupType[NodeGroupType.Condition]:
            this.command.addConditionWith(dropData.identifier, dropData.name);
            break;
          case NodeGroupType[NodeGroupType.Decorator]:
            this.command.addDecoratorWith(DecoratorType[dropData.nodeSubType]);
            break;
          case NodeGroupType[NodeGroupType.Composite]:
            this.command.addCompositeWith(CompositeType[dropData.nodeSubType]);
            break;
          default:
            return;
        }
      }
    });
  }
}
