import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  filter,
  first,
  from,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ProjectExportService } from '../../../interface/services/project-export.service';
import { ProjectImportService } from '../../../interface/services/project-import.service';
import { SPProject } from '../../../store/models/sp-project.model';
import { ProjectStoreService } from '../../../store/services/project-store.service';
import { TreeStoreService } from '../../../store/services/tree-store.service';
import { Destroy } from '../../../base/components/destory';
import { ProjectFactoryService } from '../../services/project.factory.service';
import { DashboardProjectsDeleteDialogComponent } from '../dashboard-projects-delete-dialog/dashboard-projects-delete-dialog.component';
import { DashboardProjectsDialogComponent } from '../dashboard-projects-dialog/dashboard-projects-dialog.component';
import { AsyncPipe, NgFor } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'sp-dashboard-projects',
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, AsyncPipe, FlexModule],
  providers: [ProjectFactoryService],
})
export class DashboardProjectsComponent extends Destroy {
  projects$: Observable<SPProject[]>;
  private reloadSubject = new Subject<boolean>();

  urlSubject = new Subject<SafeUrl>();

  constructor(
    private modalService: NgbModal,
    private projectFactory: ProjectFactoryService,
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService,
    private toastr: ToastrService,
    private router: Router,
    private projectExport: ProjectExportService,
    private projectImport: ProjectImportService
  ) {
    super();

    this.projects$ = this.reloadSubject.pipe(
      takeUntil(this.destroy$),
      startWith(true),
      switchMap(() => this.projectStore.allProjects$)
    );
  }

  addProject(): void {
    from(
      this.modalService.open(DashboardProjectsDialogComponent, {
        centered: true,
      }).result
    )
      .pipe(
        takeUntil(this.destroy$),
        filter((name) => name !== undefined),
        switchMap((name) => this.projectFactory.createProject(name))
      )
      .subscribe(() => {
        this.toastr.success('project added');
        this.reloadSubject.next(true);
      });
  }

  renameProject(project: SPProject): void {
    const dialog = this.modalService.open(DashboardProjectsDialogComponent, {
      centered: true,
    });
    dialog.componentInstance.name = project.name;
    dialog.componentInstance.isEdit = true;

    from(dialog.result)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (name: string) => {
          if (name) {
            project.name = name;
            this.projectStore.updateProject(project).subscribe({
              next: () => this.toastr.success('project renamed'),
            });
            this.reloadSubject.next(true);
          }
        },
      });
  }

  deleteProject(project: SPProject): void {
    const dialog = this.modalService.open(
      DashboardProjectsDeleteDialogComponent,
      {
        centered: true,
      }
    );
    dialog.componentInstance.name = project.name;
    from(dialog.result)
      .pipe(
        first(),
        filter((result) => result && result.delete),
        switchMap(() => this.projectStore.deleteProject(project.id)),
        switchMap(() => this.treeStore.deleteByProjectId(project.id))
      )
      .subscribe({
        next: () => {
          this.toastr.success('project deleted');
          this.reloadSubject.next(true);
        },
      });
  }

  openEditor(project: SPProject): void {
    this.projectStore.saveActiveProject(project);
    this.router.navigate(['editor']);
  }

  downloadProject(project: SPProject): void {
    this.projectExport
      .exportProject(project)
      .pipe(first())
      .subscribe((json) => {
        const file = new Blob([json], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'sp-project.json';
        link.click();
        link.remove();
      });
  }

  async uploadProject(event) {
    const file: File = event.target.files[0];
    from(file.text())
      .pipe(first())
      .subscribe((json) => {
        this.projectImport
          .importProject(json)
          .pipe(first())
          .subscribe({
            next: () => {
              this.toastr.success('project importet successfully');
              this.reloadSubject.next(true);
            },
            error: (err) => {
              this.toastr.error('project file invalid');
              console.log(err);
            },
          });
      });
  }
}
