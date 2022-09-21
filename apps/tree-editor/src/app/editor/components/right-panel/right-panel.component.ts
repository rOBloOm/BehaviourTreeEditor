import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map, Observable, takeUntil } from 'rxjs';
import { Destroy } from '../../../shared/components/destory';
import { SelectionService } from '../../services/selection.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sp-editor-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent extends Destroy {
  selectedTitle$: Observable<string>;
  hideRightPanel$: Observable<boolean>;
  hideRightPanel: boolean;

  constructor(private selection: SelectionService) {
    super();

    this.selectedTitle$ = selection.selected$.pipe(
      map((selected) => (selected ? selected.text.value : ''))
    );

    selection.selected$
      .pipe(
        takeUntil(this.destroy$),
        map((selected) => !selected)
      )
      .subscribe((hidePanel) => {
        this.hideRightPanel = hidePanel;
      });
  }

  clicked(event: MouseEvent) {
    event.preventDefault();
  }
}
