import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Destroy } from '../../../base/components/destory';

@Injectable()
export class CanvasMouseService extends Destroy {
  mouseX: number;
  mouseY: number;

  get isMouseInsideCanvas(): boolean {
    return this.mouseInsideCanvasSubject.value;
  }

  private mouseInsideCanvasSubject = new BehaviorSubject<boolean>(false);
  mouseInsideCanvas$ = this.mouseInsideCanvasSubject.asObservable();

  private mouseDownSubject = new Subject<MouseEvent>();
  mouseDown$ = this.mouseDownSubject.asObservable();

  private doubleClickSubject = new Subject<MouseEvent>();
  doubleClick$ = this.doubleClickSubject.asObservable();

  private mouseUpSubject = new Subject<MouseEvent>();
  mouseUp$ = this.mouseUpSubject.asObservable();

  private mouseMoveSubject = new Subject<MouseEvent>();
  mouseMove$ = this.mouseMoveSubject.asObservable();

  private wheelSubject = new Subject<WheelEvent>();
  wheel$ = this.wheelSubject.asObservable();

  private dragSubject = new Subject<DragEvent>();
  drag$ = this.dragSubject.asObservable();

  private dropSubject = new Subject<DragEvent>();
  drop$ = this.dropSubject.asObservable();

  constructor() {
    super();
    this.trackMouse();
  }

  mouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.mouseDownSubject.next(event);
  }

  doubleClick(event: MouseEvent): void {
    event.preventDefault();
    this.doubleClickSubject.next(event);
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

  dragOver(event: DragEvent): void {
    this.mouseMoveSubject.next(event);
    this.dragSubject.next(event);
  }

  dragEnter(event: DragEvent): void {
    this.mouseInsideCanvasSubject.next(true);
  }

  dragLeave(event: DragEvent): void {
    this.mouseInsideCanvasSubject.next(false);
  }

  drop(event: DragEvent): void {
    this.dropSubject.next(event);
  }

  private trackMouse(): void {
    this.mouseMove$.pipe(takeUntil(this.destroy$)).subscribe((mouse) => {
      this.mouseX = mouse.x;
      this.mouseY = mouse.y;
    });
  }
}
