import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { NodeGroupType } from '../enums/node-group-type.enum';
import { NodeGroup } from './node-group.model';
import { Text } from 'two.js/src/text';
import { Shape } from 'two.js/src/shape';

export class RootNodeGroup extends NodeGroup {
  //@TODO: Change Name to DisplayName
  override get name(): string {
    return '@';
  }

  get nodeType(): NodeGroupType {
    return NodeGroupType.Root;
  }

  constructor(group: Group, shape: Path, text: Text, anchorOut: Shape) {
    super(group, shape, text);
    this.anchorOut = anchorOut;
  }

  acceptIncoming(sourceType: NodeGroupType) {
    return false;
  }

  acceptOutgoing(): boolean {
    return true;
  }

  acceptMultipleOutgoing(): boolean {
    return false;
  }
}
