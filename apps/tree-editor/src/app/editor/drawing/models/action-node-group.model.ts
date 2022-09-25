import { NodeGroup } from './node-group.model';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Text } from 'two.js/src/text';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { Shape } from 'two.js/src/shape';
import { ICustomReference } from '../interfaces/custom-reference.interface';

export class ActionNodeGroup extends NodeGroup implements ICustomReference {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Action;
  }

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    anchroIn: Shape,
    public customReference: string
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
