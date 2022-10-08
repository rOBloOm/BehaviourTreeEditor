import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  filter,
  first,
  from,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SPNode } from '../../../data/models/sp-node.model';
import { SPProject } from '../../../data/models/sp-project.model';
import { ProjectStoreService } from '../../../data/services/project-store.service';
import { TreeStoreService } from '../../../data/services/tree-store.service';
import { Destroy } from '../../../utils/components/destory';
import { ProjectFactoryService } from '../../services/project.factory.service';
import { DashboardProjectsDeleteDialogComponent } from '../dashboard-projects-delete-dialog/dashboard-projects-delete-dialog.component';
import { DashboardProjectsDialogComponent } from '../dashboard-projects-dialog/dashboard-projects-dialog.component';

@Component({
  selector: 'sweet-potato-dashboard-projects',
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectFactoryService],
})
export class DashboardProjectsComponent extends Destroy {
  projects$: Observable<SPProject[]>;
  private reloadSubject = new Subject<boolean>();
  constructor(
    private modalService: NgbModal,
    private projectFactory: ProjectFactoryService,
    private projectStore: ProjectStoreService,
    private toastr: ToastrService,
    private router: Router
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
        error: () => {},
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
        switchMap(() => this.projectStore.deleteProject(project.id))
      )
      .subscribe({
        error: () => this.toastr.error('error deleting project'),
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
}
