import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ILeafNodeGroup } from '../../drawing/interfaces/parameters-interface.model';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { Destroy } from '@sweet-potato/core';

@Component({
  selector: 'sp-right-panel-parameters',
  templateUrl: './right-panel-parameters.component.html',
  styleUrls: ['./right-panel-parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelParametersComponent extends Destroy {
  private parameterCountSubject = new BehaviorSubject<number[]>([]);
  parameterCount$ = this.parameterCountSubject.asObservable();

  node: ILeafNodeGroup;

  constructor(private selection: CanvasSelectionService) {
    super();

    selection.selected$.pipe(takeUntil(this.destroy$)).subscribe((leaf) => {
      this.node = leaf as unknown as ILeafNodeGroup;
      if (!this.node) return;
      this.parameterCountSubject.next(Array(this.node.parameters.length));
    });
  }

  addParameter(): void {
    this.node.parameters.push('');
    this.parameterCountSubject.next(Array(this.node.parameters.length));
  }

  removeParameter(index: number): void {
    this.node.parameters.splice(index, 1);
    this.parameterCountSubject.next(Array(this.node.parameters.length));
  }

  parameterEdited($event: Event, index: number): void {
    const selected = this.selection
      .currentSelected as unknown as ILeafNodeGroup;
    selected.parameters[index] = ($event.target as HTMLInputElement).value;
  }

  getParameterValue(index: number): string {
    return this.node.parameters[index];
  }
}
