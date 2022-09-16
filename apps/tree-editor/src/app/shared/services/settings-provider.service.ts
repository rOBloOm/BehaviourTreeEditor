import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsProviderService {
  style: CSSStyleDeclaration;

  constructor() {
    this.style = getComputedStyle(document.body);
  }

  get bgBaseColor(): string {
    return this.getCSSProperty('--base-bg-color');
  }

  get nodeDecoratorFillColor(): string {
    return this.getCSSProperty('--node-decorator-fill-color');
  }

  get nodeConditionFillColor(): string {
    return this.getCSSProperty('--node-condition-fill-color');
  }

  get nodeCompositeFillColor(): string {
    return this.getCSSProperty('--node-composite-fill-color');
  }

  get nodeActionFillColor(): string {
    return this.getCSSProperty('--node-action-fill-color');
  }

  get nodeBorderColor(): string {
    return this.getCSSProperty('--node-border-color');
  }

  get nodeSymbolColor(): string {
    return this.getCSSProperty('--node-symbol-color');
  }

  private getCSSProperty(name: string): string {
    return this.style.getPropertyValue(name);
  }
}
