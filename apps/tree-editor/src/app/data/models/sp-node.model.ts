export class SPNode {
  name: string;

  //Maps to a specific node type eg. Selector, Sequence, Failer
  type: string;

  //Maps to Cockpit Action or Sensor Condition
  customReference: string;

  children: SPNode[];
  x: number;
  y: number;
}
