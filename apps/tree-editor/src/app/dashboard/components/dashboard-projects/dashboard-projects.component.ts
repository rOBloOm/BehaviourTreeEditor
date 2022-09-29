import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sweet-potato-dashboard-projects',
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProjectsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
