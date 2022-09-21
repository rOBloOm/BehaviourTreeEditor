import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InputService } from '../../services/input.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sp-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  title = _('SP.Editor.Title');

  constructor(
    private input: InputService,
    private titleService: Title,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.translateService.get(this.title).subscribe((title) => {
      this.titleService.setTitle(title);
    });
  }
}
