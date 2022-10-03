export class SPNode {
  displayName: string;
  //The project refernce
  projectId: number;

  //Maps to a specific node type eg. Selector, Sequence, Failer
  type: string;

  //Maps to Cockpit Action or Sensor Condition
  identifier: string;

  children: SPNode[];
  x: number;
  y: number;
}
