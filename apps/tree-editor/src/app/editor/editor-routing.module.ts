import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodesPanelComponent as NodesPanelComponent } from './components/nodes-panel/nodes-panel.component';

const routes: Routes = [
  {
    path: '',
    component: NodesPanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
