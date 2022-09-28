import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { NodeGroup } from './node-group.model';
import { Text } from 'two.js/src/text';

export class TreeNodeGroup extends NodeGroup {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Tree;
  }

  get displayName(): string {
    return this.identifier;
  }

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    anchorIn: Shape,
    public identifier: string
  ) {
    super(group, shape, text);
    this.anchorIn = anchorIn;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType == NodeGroupType.Composite ||
      sourceType === NodeGroupType.Decorator
    );
  }

  acceptOutgoing(): boolean {
    return false;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
