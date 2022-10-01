import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { from, Observable, of, takeUntil } from 'rxjs';
import { SPProject } from '../../../data/models/sp-project.model';
import { ProjectStoreService } from '../../../data/services/project-store.service';
import { TreeStoreService } from '../../../data/services/tree-store.service';
import { Destroy } from '../../../utils/components/destory';
import { DashboardProjectsDeleteDialogComponent } from '../dashboard-projects-delete-dialog/dashboard-projects-delete-dialog.component';
import { DashboardProjectsDialogComponent } from '../dashboard-projects-dialog/dashboard-projects-dialog.component';

@Component({
  selector: 'sweet-potato-dashboard-projects',
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsComponent extends Destroy {
  projects$: Observable<SPProject[]>;

  constructor(
    private modalService: NgbModal,
    private projectStore: ProjectStoreService,
    private treeStore: TreeStoreService,
    private toastr: ToastrService,
    private router: Router
  ) {
    super();

    this.projects$ = this.projectStore.allProjects$;
  }

  addProject(): void {
    from(
      this.modalService.open(DashboardProjectsDialogComponent, {
        centered: true,
      }).result
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((name: string) => {
        if (name) {
          this.projectStore.addProject(name);
          this.toastr.success('project added');
        }
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
            this.projectStore.updateProject(project);
            this.toastr.success('project renamed');
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {},
        next: (result) => {
          if (result && result.delete) {
            if (project.rootNodeId >= 0) {
              this.treeStore.delete(project.rootNodeId);
            }
            this.projectStore.deleteProject(project.id);
            this.toastr.success('project deleted');
          }
        },
      });
  }

  openEditor(project: SPProject): void {
    this.projectStore.setActive(project);
    this.router.navigate(['editor']);
  }
}
