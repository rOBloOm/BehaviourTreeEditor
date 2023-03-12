export interface INode {
  //Data
  identifier: string;
  type: string;
  displayName: string;
  children: INode[];
  parameters: string[];
  //Editor settings
  x: number;
  y: number;
}
