import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlazeFiringListComponent } from './components/glaze-firing-list/glaze-firing-list.component';

const routes: Routes = [
  { path: '', component: GlazeFiringListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlazeFiringRoutingModule { }
