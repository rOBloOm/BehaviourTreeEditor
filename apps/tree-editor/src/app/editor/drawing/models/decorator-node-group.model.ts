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

  get identifier(): string {
    return DecoratorType[this.decoratorType];
  }

  get displayName(): string {
    return this.identifier;
  }

  constructor(
    group: Group,
    shape: Path,
    text: Text,
    anchorIn: Shape,
    anchorOut: Shape,
    public decoratorType: DecoratorType
  ) {
    super(group, shape, text);
    this.anchorIn = anchorIn;
    this.anchorOut = anchorOut;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType === NodeGroupType.Composite ||
      sourceType === NodeGroupType.Condition ||
      sourceType === NodeGroupType.Root
    );
  }

  acceptOutgoing(): boolean {
    return true;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
