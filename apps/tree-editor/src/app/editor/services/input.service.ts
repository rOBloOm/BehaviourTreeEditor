import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class InputService {
  private keyDownSubject = new Subject<KeyboardEvent>();
  keyDown$ = this.keyDownSubject.asObservable();

  private keyUpSubject = new Subject<KeyboardEvent>();
  keyUp$ = this.keyUpSubject.asObservable();

  private keyPressedSubject = new Subject<KeyboardEvent>();
  keyPressed$ = this.keyPressedSubject.asObservable();

  private mouseDownSubject = new Subject<MouseEvent>();
  mouseDown$ = this.mouseDownSubject.asObservable();

  private mouseUpSubject = new Subject<MouseEvent>();
  mouseUp$ = this.mouseUpSubject.asObservable();

  private mouseMoveSubject = new Subject<MouseEvent>();
  mouseMove$ = this.mouseMoveSubject.asObservable();

  private wheelSubject = new Subject<WheelEvent>();
  wheel$ = this.wheelSubject.asObservable();

  constructor() {}

  keyPressed(event: KeyboardEvent): void {
    event.preventDefault();
    this.keyPressedSubject.next(event);
  }

  keyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.keyDownSubject.next(event);
  }

  keyUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.keyUpSubject.next(event);
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
}
