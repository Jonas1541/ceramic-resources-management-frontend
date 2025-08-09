import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlazeListComponent } from './components/glaze-list/glaze-list.component';

const routes: Routes = [
  { path: '', component: GlazeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlazeRoutingModule { }
