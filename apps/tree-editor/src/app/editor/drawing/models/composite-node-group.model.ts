import { Group } from 'two.js/src/group';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { NodeGroup } from './node-group.model';
import { Text } from 'two.js/src/text';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { CompositeType } from '../enums/composite-type.enum';

export class CompositeNodeGroup extends NodeGroup {
  get nodeType(): NodeGroupType {
    return NodeGroupType.Composite;
  }

  get identifier(): string {
    return CompositeType[this.compositeType];
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
    public compositeType: CompositeType
  ) {
    super(group, shape, text);
    this.anchorIn = anchorIn;
    this.anchorOut = anchorOut;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return (
      sourceType === NodeGroupType.Root || sourceType == NodeGroupType.Composite
    );
  }

  acceptOutgoing(): boolean {
    return true;
  }

  acceptMultipleOutgoing(): boolean {
    return true;
  }
}
