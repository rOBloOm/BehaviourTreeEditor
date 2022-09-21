import { Injectable } from '@angular/core';
import Two from 'two.js';
import { Group } from 'two.js/src/group';
import { Path } from 'two.js/src/path';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { NodeGroup, NodeGroupType } from './node.group';
import { EditorSettings } from './settings';
import { CanvasService } from '../services/canvas.service';
import { throwIfEmpty } from 'rxjs';
import { root } from 'two.js/src/utils/root';

@Injectable()
export class DrawingService {
  private get textStyle(): any {
    return {
      size: 18,
      weight: 400,
      leading: this.canvas.two.width * 0.08 * 0.8,
      family: 'Angus, Arial, sans-serif',
      alignment: 'center',
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      fill: EditorSettings.nodeSymbolColor,
    };
  }

  constructor(private canvas: CanvasService) {}

  createRootNode(x: number, y: number): NodeGroup {
    //Text Shape
    const rootText = this.canvas.two.makeText('@', x, y, this.textStyle);

    //Root Shape
    const rootShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      EditorSettings.rootNodeWidth,
      EditorSettings.nodeHeight,
      EditorSettings.nodeRadius
    );
    rootShape.stroke = EditorSettings.nodeBorderColor;
    rootShape.fill = EditorSettings.rootFillColor;
    //Anchor Shape
    const outAnchorShape = this.createAnchor(
      x,
      y + EditorSettings.nodeHeight / 2 + EditorSettings.nodeLineWith
    );

    //Node Group
    //NodeGroup
    const nodeGroup = this.canvas.two.makeGroup([
      outAnchorShape,
      rootShape,
      rootText,
    ]);

    const ng = new NodeGroup(
      nodeGroup,
      rootShape,
      rootText,
      NodeGroupType.Root
    );

    ng.outAnchor = outAnchorShape;
    return ng;
  }

  createActionNode(x: number, y: number, text: string): NodeGroup {
    //Text Shape
    const actionText = this.canvas.two.makeText(text, x, y, this.textStyle);
    const textBoundsWidth =
      actionText.getBoundingClientRect().width / this.canvas.zui.scale;
    //Action Shape
    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      EditorSettings.nodeHeight,
      EditorSettings.nodeRadius
    );

    actionShape.fill = EditorSettings.nodeActionFillColor;
    actionShape.stroke = EditorSettings.nodeBorderColor;
    actionShape.linewidth = EditorSettings.nodeLineWith;

    //Anchor Shape
    const anchorShape = this.createAnchor(
      x,
      y - EditorSettings.nodeHeight / 2 - EditorSettings.anchorLineWidth
    );

    //NodeGroup
    const nodeGroup = this.canvas.two.makeGroup([
      anchorShape,
      actionShape,
      actionText,
    ]);

    const ng = new NodeGroup(
      nodeGroup,
      actionShape,
      actionText,
      NodeGroupType.Action
    );
    ng.inAnchor = anchorShape;
    return ng;
  }

  createCompositeNode(x: number, y: number, text: string): NodeGroup {
    //Text Shape
    const actionText = this.canvas.two.makeText(
      '=> ' + text + ' =>',
      x,
      y,
      this.textStyle
    );
    const textBoundsWidth = actionText.getBoundingClientRect().width;

    //Action Shape
    const actionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      EditorSettings.nodeHeight,
      EditorSettings.nodeRadius
    );

    actionShape.fill = EditorSettings.nodeCompositeFillColor;
    actionShape.stroke = EditorSettings.nodeBorderColor;
    actionShape.linewidth = EditorSettings.nodeLineWith;

    //Anchor Shapes
    const inAnchorShape = this.createAnchor(
      x,
      y - EditorSettings.nodeHeight / 2 - EditorSettings.nodeLineWith
    );

    const outAnchorShape = this.createAnchor(
      x,
      y + EditorSettings.nodeHeight / 2 + EditorSettings.nodeLineWith
    );

    const nodeGroup = this.canvas.two.makeGroup([
      inAnchorShape,
      outAnchorShape,
      actionShape,
      actionText,
    ]);

    const ng = new NodeGroup(
      nodeGroup,
      actionShape,
      actionText,
      NodeGroupType.Composite
    );
    ng.inAnchor = inAnchorShape;
    ng.outAnchor = outAnchorShape;
    return ng;
  }

  createConnection(source: NodeGroup, target: NodeGroup): Path {
    const xs = source.group.position.x + source.outAnchor.position.x;
    const ys = source.group.position.y + source.outAnchor.position.y;
    const xt = target.group.position.x + target.inAnchor.position.x;
    const yt = target.group.position.y + target.inAnchor.position.y;

    const direction = new Two.Vector(xt - xs, yt - ys).normalize();

    const arrowPath = this.canvas.two.makeArrow(
      xs + direction.x * EditorSettings.connectionMargin,
      ys + direction.y * EditorSettings.connectionMargin,
      xt - direction.x * EditorSettings.connectionMargin,
      yt - direction.y * EditorSettings.connectionMargin,
      EditorSettings.connectionArrowSize
    );

    arrowPath.stroke = EditorSettings.connectionLineColor;
    arrowPath.linewidth = EditorSettings.connectionArrowLineWidth;

    return arrowPath;
  }

  private createAnchor(x: number, y: number): Path {
    const anchorShape = this.canvas.two.makeCircle(x, y, 10);
    anchorShape.fill = EditorSettings.anchorFillColor;
    anchorShape.stroke = EditorSettings.anchorBorderColor;
    anchorShape.linewidth = EditorSettings.anchorLineWidth;
    return anchorShape;
  }

  private getRectWidth(textBoundsWidth: number): number {
    if (textBoundsWidth < 40) return 40;
    if (textBoundsWidth < 700) return textBoundsWidth;
    return textBoundsWidth * 0.7;
  }
}
