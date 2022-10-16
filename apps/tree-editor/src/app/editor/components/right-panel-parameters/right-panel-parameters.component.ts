import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  first,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { Destroy } from '../../../base/components/destory';
import { ILeafNodeGroup } from '../../drawing/interfaces/parameters-interface.model';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';

@Component({
  selector: 'sp-right-panel-parameters',
  templateUrl: './right-panel-parameters.component.html',
  styleUrls: ['./right-panel-parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelParametersComponent extends Destroy {
  parametersSubject = new BehaviorSubject<string[]>([]);
  parameters$ = this.parametersSubject.asObservable();

  constructor(private selection: CanvasSelectionService) {
    super();

    selection.selected$
      .pipe(first())
      .subscribe((leaf) =>
        this.parametersSubject.next(
          (leaf as unknown as ILeafNodeGroup).parameters
        )
      );
  }

  addParameter(): void {
    this.parametersSubject.value.push('');
  }

  removeParameter(index: number): void {
    this.parametersSubject.value.splice(index, 1);
  }

  parameterEdited($event: Event, index: number): void {
    // const selected = this.selection
    //   .currentSelected as unknown as ILeafNodeGroup;
    // selected.parameters[index] = ($event.target as HTMLInputElement).value;
  }
}
