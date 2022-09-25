import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { Text } from 'two.js/src/text';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { ICustomReference } from '../interfaces/custom-reference.interface';
import { NodeGroup } from './node-group.model';

export class ConditionNodeGroup extends NodeGroup implements ICustomReference {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Condition;
  }

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    anchorIn: Shape,
    public customReference: string
  ) {
    super(group, shape, text);
    this.anchorIn = anchorIn;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType == NodeGroupType.Composite ||
      sourceType == NodeGroupType.Decorator ||
      sourceType == NodeGroupType.Root
    );
  }

  acceptOutgoing(): boolean {
    return true;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
