import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImportService } from '../../data/services/import.service';
import { StorageService } from '../../data/services/storage.service';
import { CanvasManagerService } from './canvas-manager.service';

@Injectable()
export class CommandService {
  constructor(
    private storage: StorageService,
    private manager: CanvasManagerService,
    private toastr: ToastrService,
    private importer: ImportService
  ) {}

  saveActiveTree(): void {
    this.storage.save(this.manager.root);
    this.toastr.success('Tree has been saved!', 'Save Action', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  loadTree(): void {
    const tree = this.storage.load();
    this.importer.import(tree);
    this.toastr.success('Tree has been imported!', 'Import Action', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  clearTree(): void {
    this.manager.clear();
  }
}
