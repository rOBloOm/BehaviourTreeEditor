import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { Text } from 'two.js/src/text';
import { NodeConnection } from './node.connection';
import { EditorSettings } from './settings';

export class NodeGroup {
  connectionIn: NodeConnection;
  connectionsOut: NodeConnection[] = [];

  inAnchor: Shape = undefined;
  outAnchor: Shape = undefined;

  get id(): string {
    return this.group.id;
  }

  selected = false;

  constructor(
    public group: Group,
    public shape: Path,
    public text: Text,
    public type: NodeGroupType
  ) {}
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

  acceptIncoming(sourceType: NodeGroupType): boolean {
    switch (this.type) {
      case NodeGroupType.Root:
        return false;
      case NodeGroupType.Composite:
        return (
          sourceType === NodeGroupType.Root ||
          sourceType == NodeGroupType.Composite
        );
      case NodeGroupType.Decorator:
        return (
          sourceType === NodeGroupType.Root ||
          sourceType == NodeGroupType.Composite
        );
      case NodeGroupType.Action:
      case NodeGroupType.Condition:
        return (
          sourceType == NodeGroupType.Composite ||
          sourceType == NodeGroupType.Decorator
        );
    }
  }

  acceptOutgoing(): boolean {
    return this.outAnchor !== undefined;
  }
}

export enum NodeGroupType {
  Root = 0,
  Composite = 1,
  Decorator = 2,
  Action = 3,
  Condition = 4,
}
