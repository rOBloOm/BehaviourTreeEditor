import { NodeGroup } from './node-group.model';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Text } from 'two.js/src/text';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { DecoratorType } from '../enums/decorator-type.enum';
import { Shape } from 'two.js/src/shape';

export class DecoratorNodeGroup extends NodeGroup {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Decorator;
  }

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    public decoratorType: DecoratorType,
    anchorIn: Shape,
    anchorOut: Shape
  ) {
    super(group, shape, text);
    this.anchorIn = anchorIn;
    this.anchorOut = anchorOut;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType === NodeGroupType.Composite ||
      sourceType === NodeGroupType.Condition
    );
  }

  acceptOutgoing(): boolean {
    return true;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
