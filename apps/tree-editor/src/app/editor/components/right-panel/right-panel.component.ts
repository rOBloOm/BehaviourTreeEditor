import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Destroy } from '../../../shared/components/destory';
import { SelectionService } from '../../services/selection.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { NodeGroup } from '../../drawing/models/node-group.model';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CanvasManagerService } from '../../services/canvas-manager.service';

@Component({
  selector: 'sp-editor-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent extends Destroy {
  selected$: Observable<NodeGroup>;
  nodeType: string;
  form: FormGroup;

  constructor(
    selection: SelectionService,
    private manager: CanvasManagerService,
    fb: FormBuilder
  ) {
    super();

    this.form = fb.group({
      displayName: null,
    });

    this.selected$ = selection.selected$;

    //Update Values form selected Node
    this.selected$.pipe(takeUntil(this.destroy$)).subscribe((selected) => {
      if (selected) {
        this.nodeType = selected ? NodeGroupType[selected.nodeType] : '';
        this.form.setValue({
          displayName: selected.displayName,
        });
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
