import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  combineLatest,
  filter,
  Observable,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Destroy } from '../../../base/components/destory';
import { NodeGroupType } from '../../drawing/enums/node-group-type.enum';
import { NodeGroup } from '../../drawing/models/node-group.model';
import { CanvasManagerService } from '../../drawing/systems/canvas-manager.service';
import { CanvasSelectionService } from '../../drawing/systems/canvas-selection.service';
import { EditorManagerService } from '../../services/editor-manager.service';

@Component({
  selector: 'sp-editor-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent extends Destroy {
  selected$: Observable<NodeGroup>;
  nodeType: string;

  parameters: string[] = [];

  form = new FormGroup({
    displayName: new FormControl<string>(''),
  });

  constructor(
    private canvas: CanvasManagerService,
    private editor: EditorManagerService,
    selection: CanvasSelectionService
  ) {
    super();

    this.selected$ = selection.selected$;

    //Update Values form selected Node
    this.selected$
      .pipe(
        takeUntil(this.destroy$),
        filter((selected) => selected !== undefined),
        switchMap((selected) =>
          combineLatest([
            of(selected),
            this.editor.activeTree$.pipe(
              switchMap((tree) => this.editor.isRootTree$(tree.identifier))
            ),
          ])
        )
      )
      .subscribe(([selected, isRoot]) => {
        console.log(selected);
        if (selected) {
          this.nodeType = selected ? NodeGroupType[selected.nodeType] : '';
          this.form.controls.displayName.setValue(selected.displayName);

          if (this.disableNode(selected.nodeType, isRoot)) {
            this.form.controls.displayName.disable();
          } else {
            this.form.controls.displayName.enable();
          }
        }
      });

    //Update Tree Name Observable
    combineLatest([this.form.valueChanges, this.selected$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([values, selected]) => {
        if (selected && selected.nodeType === NodeGroupType.Root) {
          this.canvas.updateCurrentTreeDisplayName(values.displayName);
        }
      });

    this.editor.activeTree$
      .pipe(
        takeUntil(this.destroy$),
        filter((tree) => tree !== undefined),
        switchMap((tree) => this.editor.isRootTree$(tree.identifier))
      )
      .subscribe((isRoot) =>
        isRoot
          ? this.form.controls.displayName.disable()
          : this.form.controls.displayName.enable()
      );
  }

  disableNode(nodeType: NodeGroupType, isRoot: boolean): boolean {
    switch (nodeType) {
      case NodeGroupType.Action:
      case NodeGroupType.Condition:
      case NodeGroupType.Composite:
      case NodeGroupType.Decorator:
      case NodeGroupType.Tree:
        return true;
      case NodeGroupType.Root:
        return isRoot;
      default:
        return false;
    }
  }
}
