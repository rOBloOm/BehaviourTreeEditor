import {Shape} from "createjs-module";

export function makeAnchor(shape: Shape, x: number, y: number, radius: number, bg_color: string, border_width: number, border_color: string) {
  shape.graphics.beginFill(bg_color);
  shape.graphics.setStrokeStyle(border_width, 'round');
  shape.graphics.beginStroke(border_color);
  shape.graphics.drawCircle(x, y, radius);
  shape.graphics.endStroke();
  shape.graphics.endFill();
}

export function makeRect(shape: Shape, w: number, h: number, radius: number, bg_color: string, border_width: number, border_color: string) {
  shape.graphics.beginFill(bg_color);
  shape.graphics.setStrokeStyle(border_width, 'round');
  shape.graphics.beginStroke(border_color);
  shape.graphics.drawRoundRect(-w/2, -h/2, w, h, radius);
  shape.graphics.endStroke();
  shape.graphics.endFill();
}

export function makeTree(shape: Shape, w: number, h: number, radius: number, bg_color: string, border_width: number, border_color: string) {
  shape.graphics.beginFill(bg_color);
  shape.graphics.setStrokeStyle(border_width, 'round');
  shape.graphics.beginStroke(border_color);
  shape.graphics.moveTo(-w/2, 0);
  shape.graphics.lineTo(-w/2+10, -h/2);
  shape.graphics.lineTo(w/2-10, -h/2);
  shape.graphics.lineTo(w/2, 0);
  shape.graphics.lineTo(w/2-10, h/2);
  shape.graphics.lineTo(-w/2+10, h/2);
  shape.graphics.lineTo(-w/2, 0);
  shape.graphics.endStroke();
  shape.graphics.endFill();
}

export function makeEllipse(shape: Shape, w: number, h: number, bg_color: string, border_width: number, border_color: string) {
  shape.graphics.beginFill(bg_color);
  shape.graphics.setStrokeStyle(border_width, 'round');
  shape.graphics.beginStroke(border_color);
  shape.graphics.drawEllipse(-w/2, -h/2, w, h);
  shape.graphics.endStroke();
  shape.graphics.endFill();
}

export function makeRhombus (shape: Shape, w: number, h: number, bg_color: string, border_width: number, border_color: string) {
  shape.graphics.beginFill(bg_color);
  shape.graphics.setStrokeStyle(border_width, 'round');
  shape.graphics.beginStroke(border_color);
  shape.graphics.moveTo(0, h/2);
  shape.graphics.lineTo(w/2, 0);
  shape.graphics.lineTo(0, -h/2);
  shape.graphics.lineTo(-w/2, 0);
  shape.graphics.lineTo(0, h/2);
  shape.graphics.endStroke();
  shape.graphics.endFill();
}
