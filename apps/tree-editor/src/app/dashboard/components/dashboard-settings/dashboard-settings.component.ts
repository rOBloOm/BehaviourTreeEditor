import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sweet-potato-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
