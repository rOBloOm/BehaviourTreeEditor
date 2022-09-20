import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable, takeUntil } from 'rxjs';
import { Destroy } from '../../../shared/components/destory';
import { SelectionService } from '../../services/selection.service';

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
