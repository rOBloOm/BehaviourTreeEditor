import { NodeGroup } from './node-group.model';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Text } from 'two.js/src/text';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { Shape } from 'two.js/src/shape';
import { ILeafNodeGroup } from '../interfaces/parameters-interface.model';

export class ActionNodeGroup extends NodeGroup implements ILeafNodeGroup {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Action;
  }

  get displayName(): string {
    return this.text.value;
  }

  parameters: string[] = [];

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    anchroIn: Shape,
    public identifier: string
  ) {
    super(group, shape, text);
    this.anchorIn = anchroIn;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType == NodeGroupType.Composite ||
      sourceType == NodeGroupType.Decorator ||
      sourceType == NodeGroupType.Root
    );
  }

  acceptOutgoing(): boolean {
    return false;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
