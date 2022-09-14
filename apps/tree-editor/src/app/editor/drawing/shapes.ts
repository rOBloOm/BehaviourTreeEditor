import Two from 'two.js';
import { Rectangle } from 'two.js/src/shapes/rectangle';

export function makeRect2(
  two: Two,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): Rectangle {
  let rect = two.makeRoundedRectangle(x, y, w, h, radius);
  rect.fill = '#5f8eba';
  return rect;
}
