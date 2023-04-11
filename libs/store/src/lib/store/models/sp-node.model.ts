export class SPNode {
  id: number;

  displayName: string;
  //The project refernce
  projectId: number;

  //Maps to a specific node type eg. Selector, Sequence, Failer
  type: string;

  //Maps to Cockpit Action or Sensor Condition
  identifier: string;

  children: SPNode[];

  //Maps to the Action and Condition parameters
  parameters: string[];

  x: number;
  y: number;
}
