import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { Text } from 'two.js/src/text';
import { NodeConnection } from './node-connection.model';
import { EditorSettings } from '../drawing.settings';
import { NodeGroupType } from '../enums/node-group-type.enum';

export abstract class NodeGroup {
  connectionIn: NodeConnection;
  connectionsOut: NodeConnection[] = [];

  anchorIn: Shape = undefined;
  anchorOut: Shape = undefined;

  get id(): string {
    return this.group.id;
  }

  get x(): number {
    return this.group.position.x + this.shape.position.x;
  }

  get y(): number {
    return this.group.position.y + this.shape.position.y;
  }

  get name(): string {
    return this.text.value;
  }

  selected = false;

  abstract get nodeType(): NodeGroupType;

  constructor(public group: Group, public shape: Path, public text: Text) {}

  select() {
    this.shape.linewidth = EditorSettings.nodeLineWithSelected;
    this.shape.stroke = EditorSettings.nodeBorderSelectedColor;
    this.selected = true;
  }

  deselect() {
    this.shape.linewidth = EditorSettings.nodeLineWith;
    this.shape.stroke = EditorSettings.nodeBorderColor;
    this.selected = false;
  }

  setText(text: string): void {
    this.text.value = text;
  }

  abstract acceptIncoming(sourceType: NodeGroupType);
  abstract acceptOutgoing(): boolean;
  abstract acceptMultipleOutgoing(): boolean;

  canDelete(): boolean {
    return this.nodeType !== NodeGroupType.Root;
  }
}
