import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { from, Observable, of, takeUntil } from 'rxjs';
import { SPProject } from '../../../data/models/sp-project.model';
import { ProjectStoreService } from '../../../data/services/project-store.service';
import { Destroy } from '../../../utils/components/destory';
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
    private toastr: ToastrService
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
}
