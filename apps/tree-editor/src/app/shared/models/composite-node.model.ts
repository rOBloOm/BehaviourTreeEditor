export class CompositeNode {
  type: CompositeType;
}

export enum CompositeType {
  Selector = 1,
  PrioritySelector = 2,
  Sequence = 3,
  PrioritySequence = 4,
}
