import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MouseInputService } from '../../services/mouse-input.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { DrawingService } from '../../drawing/drawing.service';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { CanvasService } from '../../services/canvas.service';
import { CommandService } from '../../services/command.service';
import { ConnectionService } from '../../services/connection.service';
import { DragService } from '../../services/drag.service';
import { LoaderService } from '../../services/loader.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MouseInputService,
    CommandService,
    SelectionService,
    ConnectionService,
    DrawingService,
    CanvasManagerService,
    CanvasService,
    DragService,
    LoaderService,
  ],
})
export class EditorComponent implements OnInit {
  title = _('SP.Editor.Title');

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.translateService.get(this.title).subscribe((title) => {
      this.titleService.setTitle(title);
    });
  }
}
