import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map, Observable, shareReplay, takeUntil } from 'rxjs';
import { Destroy } from '../../../shared/components/destory';
import { SelectionService } from '../../services/selection.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { NodeGroup } from '../../drawing/models/node-group.model';

@Component({
  selector: 'sp-editor-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent extends Destroy {
  selected$: Observable<NodeGroup>;
  hideRightPanel$: Observable<boolean>;
  hideRightPanel: boolean;

  constructor(private selection: SelectionService) {
    super();

    this.selected$ = selection.selected$.pipe(shareReplay());
  }

  clicked(event: MouseEvent) {
    event.preventDefault();
  }
}
