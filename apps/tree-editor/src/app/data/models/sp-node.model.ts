export class SPNode {
  displayName: string;

  //Maps to a specific node type eg. Selector, Sequence, Failer
  type: string;

  //Maps to Cockpit Action or Sensor Condition
  identifier: string;

  children: SPNode[];
  x: number;
  y: number;
}
