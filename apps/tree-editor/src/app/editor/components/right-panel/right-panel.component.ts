import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable, takeUntil } from 'rxjs';
import { SelectionService } from '../../services/selection.service';
import { NodeGroup } from '../../drawing/models/node-group.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { Destroy } from '../../../utils/components/destory';

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
    selection: SelectionService,
    private manager: CanvasManagerService
  ) {
    super();

    this.selected$ = selection.selected$;

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
          this.manager.updateCurrentTreeDisplayName(values.displayName);
        }
      });
  }
}
