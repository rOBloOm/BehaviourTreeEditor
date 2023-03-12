import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  takeUntil,
} from 'rxjs';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';
import { Destroy } from '../../../base/components/destory';
import { CanvasMouseService } from './canvas-mouse.service';

@Injectable()
export class CanvasService extends Destroy {
  private panningSubject = new BehaviorSubject<boolean>(false);

  two: Two;
  zui: ZUI;

  get pannig$(): Observable<boolean> {
    return this.panningSubject.asObservable();
  }

  constructor(private canvasMouse: CanvasMouseService) {
    super();
  }

  attach(element: HTMLElement): void {
    this.two = new Two({
      type: Two.Types.canvas,
      fullscreen: true,
      overdraw: false,
      fitted: true,
      autostart: true,
    }).appendTo(element);

    this.zui = new ZUI(this.two.scene);
    this.zui.addLimits(0.06, 8);

    this.initZoomBehavior();
    this.initPanBehaviour();
  }

  private initZoomBehavior(): void {
    this.canvasMouse.wheel$.subscribe((event) => {
      event.stopPropagation();
      event.preventDefault();

      const dy = -event.deltaY / 500;

      this.zui.zoomBy(dy, event.clientX, event.clientY);
    });
  }

  private initPanBehaviour(): void {
    let panning = false;
    const mouse = new Two.Vector();

    this.canvasMouse.mouseDown$
      .pipe(
        filter((event) => event.shiftKey && event.button === 0),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        panning = true;
        this.panningSubject.next(true);
      });

    this.canvasMouse.mouseUp$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (panning) {
        panning = false;
        this.panningSubject.next(false);
      }
    });

    combineLatest([this.canvasMouse.mouseMove$, this.pannig$])
      .pipe(
        filter(([, panning]) => panning),
        takeUntil(this.destroy$)
      )
      .subscribe(([mouseMove]) => {
        const dx = mouseMove.clientX - mouse.x;
        const dy = mouseMove.clientY - mouse.y;
        this.zui.translateSurface(dx, dy);
        mouse.set(mouseMove.clientX, mouseMove.clientY);
      });
  }
}
