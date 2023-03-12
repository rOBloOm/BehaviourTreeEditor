import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { LeafNodeImportService } from '../../services/leaf-node-import.service';

@Component({
  selector: 'sp-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSettingsComponent {
  canUpload: false;

  constructor(
    private leafNodeImporter: LeafNodeImportService,
    private toastr: ToastrService
  ) {}

  fileSelected(target: EventTarget): void {
    const input = target as HTMLInputElement;
    const file = input.files[0];

    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.leafNodeImporter
        .importLeafNodes(fileReader.result as string)
        .pipe(first())
        .subscribe({
          next: () =>
            this.toastr.success('Actions and Conditions have been importet'),
        });
    };
    fileReader.readAsText(file);
  }
}
