import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Shape } from 'two.js/src/shape';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { Text } from 'two.js/src/text';
import { EditorSettings } from './settings';

export class NodeGroup {
  text: Text;
  group: Group;
  shape: Path;

  get id(): string {
    return this.group.id;
  }

  selected = false;

  constructor(group: Group, shape: Path, text: Text) {
    this.group = group;
    this.shape = shape;
    this.text = text;
  }
  select() {
    this.shape.linewidth = EditorSettings.nodeLineWithSelected;
    this.shape.stroke = EditorSettings.nodeBorderSelectedColor;
    this.selected = true;
  }

  deselect() {
    this.shape.linewidth = EditorSettings.nodeLineWith;
    this.shape.stroke = EditorSettings.nodeBorderColor;
    this.selected = false;
  }

  setText(text: string): void {
    this.text.value = text;
  }
}
