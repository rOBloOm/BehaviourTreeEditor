import { Injectable } from '@angular/core';
import Two from 'two.js';
import { Path } from 'two.js/src/path';
import { NodeGroup } from './models/node-group.model';
import { EditorSettings } from './drawing.settings';
import { CanvasService } from '../services/canvas.service';
import { NodeGroupType } from './enums/node-group-type.enum';
import { RootNodeGroup } from './models/root-node-group.model';
import { ActionNodeGroup } from './models/action-node-group.model';
import { CompositeNodeGroup } from './models/composite-node-group.model';
import { DecoratorNodeGroup } from './models/decorator-node-group.model';
import { DecoratorType } from './enums/decorator-type.enum';
import { TreeNodeGroup } from './models/tree-node-group.model';
import { CompositeType } from './enums/composite-type.enum';
import { ConditionNodeGroup } from './models/condition-node-group.model';

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

  createRootNode(x: number, y: number, identifier: string): NodeGroup {
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

    return new RootNodeGroup(
      nodeGroup,
      rootShape,
      rootText,
      outAnchorShape,
      identifier
    );
  }

  createActionNode(
    x: number,
    y: number,
    text: string,
    identifier: string
  ): NodeGroup {
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

    return new ActionNodeGroup(
      nodeGroup,
      actionShape,
      actionText,
      anchorShape,
      identifier
    );
  }

  createConditionNode(x: number, y: number, identifier: string, text: string) {
    //Text Shape
    const actionText = this.canvas.two.makeText(text, x, y, this.textStyle);
    const textBoundsWidth =
      actionText.getBoundingClientRect().width / this.canvas.zui.scale;
    //Action Shape
    const conditionShape = this.canvas.two.makeRoundedRectangle(
      x,
      y,
      this.getRectWidth(textBoundsWidth),
      EditorSettings.nodeHeight,
      EditorSettings.nodeRadius
    );

    conditionShape.fill = EditorSettings.nodeConditionFillColor;
    conditionShape.stroke = EditorSettings.nodeBorderColor;
    conditionShape.linewidth = EditorSettings.nodeLineWith;

    //Anchor Shape
    const anchorShape = this.createAnchor(
      x,
      y - EditorSettings.nodeHeight / 2 - EditorSettings.anchorLineWidth
    );

    //NodeGroup
    const nodeGroup = this.canvas.two.makeGroup([
      anchorShape,
      conditionShape,
      actionText,
    ]);

    return new ConditionNodeGroup(
      nodeGroup,
      conditionShape,
      actionText,
      anchorShape,
      identifier
    );
  }

  createCompositeNode(
    x: number,
    y: number,
    compositeType: CompositeType
  ): NodeGroup {
    //Text Shape
    const actionText = this.canvas.two.makeText(
      CompositeType[compositeType],
      x,
      y,
      this.textStyle
    );
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

    return new CompositeNodeGroup(
      nodeGroup,
      actionShape,
      actionText,
      inAnchorShape,
      outAnchorShape,
      compositeType
    );
  }

  createDecoratorNode(x: number, y: number, type: DecoratorType): NodeGroup {
    const w = EditorSettings.nodeDecoratorWidth;
    const h = EditorSettings.nodeDecoratorHeight;

    //Decorator Shape
    const decoratorShape = this.canvas.two.makePath(
      x,
      y + h / 2,
      x + w / 2,
      y,
      x,
      y - h / 2,
      x - w / 2,
      y,
      x,
      y + h / 2
    );

    decoratorShape.fill = EditorSettings.nodeDecoratorFillColor;
    decoratorShape.stroke = EditorSettings.nodeBorderColor;

    //Text Shape
    const textShape = this.canvas.two.makeText(
      DecoratorType[type],
      x,
      y,
      this.textStyle
    );

    //Anchor Shapes
    const inAnchorShape = this.createAnchor(x, y - h / 2);

    const outAnchorShape = this.createAnchor(x, y + h / 2);

    //Node Group
    const nodeGroup = this.canvas.two.makeGroup([
      inAnchorShape,
      outAnchorShape,
      decoratorShape,
      textShape,
    ]);

    return new DecoratorNodeGroup(
      nodeGroup,
      decoratorShape,
      textShape,
      inAnchorShape,
      outAnchorShape,
      type
    );
  }

  createTreeNode(x: number, y: number, identifier: string): NodeGroup {
    //Text Shape
    const textShape = this.canvas.two.makeText(
      identifier,
      x,
      y,
      this.textStyle
    );
    const textBoundsWidth =
      textShape.getBoundingClientRect().width / this.canvas.zui.scale;

    //Tree Shape
    const w = textBoundsWidth;
    const h = EditorSettings.nodeHeight;

    const treeShape = this.canvas.two.makePath(
      x - w / 2,
      y,
      x - w / 2 + 10,
      y - h / 2,
      x + w / 2 - 10,
      y - h / 2,
      x + w / 2,
      y,
      x + w / 2 - 10,
      y + h / 2,
      x - w / 2 + 10,
      y + h / 2
    );

    treeShape.fill = EditorSettings.treeFillColor;
    treeShape.stroke = EditorSettings.nodeBorderColor;

    //Anchor Shapes
    const inAnchorShape = this.createAnchor(x, y - h / 2);

    //Node Group
    const nodeGroup = this.canvas.two.makeGroup([
      inAnchorShape,
      treeShape,
      textShape,
    ]);

    return new TreeNodeGroup(
      nodeGroup,
      treeShape,
      textShape,
      inAnchorShape,
      identifier
    );
  }

  createConnection(source: NodeGroup, target: NodeGroup): Path {
    const xs = source.group.position.x + source.anchorOut.position.x;
    const ys = source.group.position.y + source.anchorOut.position.y;
    const xt = target.group.position.x + target.anchorIn.position.x;
    const yt = target.group.position.y + target.anchorIn.position.y;

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
    if (textBoundsWidth < 400) return textBoundsWidth + 20;
    if (textBoundsWidth < 700) return textBoundsWidth;
    return textBoundsWidth * 0.7;
  }
}
