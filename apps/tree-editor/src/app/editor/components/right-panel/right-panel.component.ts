import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
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
    private selection: SelectionService,
    private manager: CanvasManagerService,
    fb: FormBuilder
  ) {
    super();

    this.form = fb.group({
      name: null,
    });

    this.selected$ = selection.selected$;

    //Update Values form selected Node
    this.selected$.pipe(takeUntil(this.destroy$)).subscribe((selected) => {
      if (selected) {
        this.nodeType = selected ? NodeGroupType[selected.nodeType] : '';
        this.form.setValue({
          name: selected.name,
        });
      }
    });

    //Update Tree Name Observable
    this.selected$
      .pipe(
        takeUntil(this.destroy$),
        filter((selected) => selected.nodeType === NodeGroupType.Tree),
        switchMap((_) => this.form.valueChanges)
      )
      .subscribe((value) => this.updateTreeName(value.name));
  }

  updateTreeName(name: string): void {}
}
