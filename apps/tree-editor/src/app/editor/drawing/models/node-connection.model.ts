import { Path } from 'two.js/src/path';
import { NodeGroup } from './node-group.model';

export class NodeConnection {
  constructor(
    public source: NodeGroup,
    public target: NodeGroup,
    public shape: Path
  ) {}
}
