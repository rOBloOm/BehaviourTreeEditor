export interface INode {
  //Data
  identifier: string;
  type: string;
  displayName: string;
  children: INode[];
  //Editor settings
  x: number;
  y: number;
}