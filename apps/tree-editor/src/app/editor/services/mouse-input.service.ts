import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Destroy } from '../../utils/components/destory';

@Injectable()
export class MouseInputService extends Destroy {
  mouseX: number;
  mouseY: number;

  get isMouseInsideCanvas(): boolean {
    return this.mouseInsideCanvasSubject.value;
  }

  private mouseInsideCanvasSubject = new BehaviorSubject<boolean>(false);
  mouseInsideCanvas$ = this.mouseInsideCanvasSubject.asObservable();

  private mouseDownSubject = new Subject<MouseEvent>();
  mouseDown$ = this.mouseDownSubject.asObservable();

  private mouseUpSubject = new Subject<MouseEvent>();
  mouseUp$ = this.mouseUpSubject.asObservable();

  private mouseMoveSubject = new Subject<MouseEvent>();
  mouseMove$ = this.mouseMoveSubject.asObservable();

  private wheelSubject = new Subject<WheelEvent>();
  wheel$ = this.wheelSubject.asObservable();

  constructor() {
    super();
    this.trackMouse();
  }

  mouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.mouseDownSubject.next(event);
  }

  mouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.mouseUpSubject.next(event);
  }

  mouseMove(event: MouseEvent): void {
    event.preventDefault();
    this.mouseMoveSubject.next(event);
  }

  wheel(event: WheelEvent): void {
    event.preventDefault();
    this.wheelSubject.next(event);
  }

  mouseEnter(event: MouseEvent): void {
    this.mouseInsideCanvasSubject.next(true);
  }

  mouseLeave(event: MouseEvent): void {
    this.mouseInsideCanvasSubject.next(false);
  }

  private trackMouse(): void {
    this.mouseMove$.pipe(takeUntil(this.destroy$)).subscribe((mouse) => {
      this.mouseX = mouse.x;
      this.mouseY = mouse.y;
    });
  }
}
