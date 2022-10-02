import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable, takeUntil } from 'rxjs';
import { NodeGroup } from '../../drawing/models/node-group.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { Destroy } from '../../../utils/components/destory';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';

@Component({
  selector: 'sp-editor-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent extends Destroy {
  selected$: Observable<NodeGroup>;
  nodeType: string;

  form = new FormGroup({
    displayName: new FormControl(''),
  });

  constructor(
    private canvasManager: CanvasManagerService,
    private canvasSelection: CanvasSelectionService
  ) {
    super();

    this.selected$ = canvasSelection.selected$;

    //Update Values form selected Node
    this.selected$.pipe(takeUntil(this.destroy$)).subscribe((selected) => {
      if (selected) {
        this.nodeType = selected ? NodeGroupType[selected.nodeType] : '';
        this.form.controls.displayName.setValue(selected.displayName);
      }
    });

    //Update Tree Name Observable
    combineLatest([this.form.valueChanges, this.selected$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([values, selected]) => {
        if (selected && selected.nodeType === NodeGroupType.Root) {
          this.canvasManager.updateCurrentTreeDisplayName(values.displayName);
        }
      });
  }
}
