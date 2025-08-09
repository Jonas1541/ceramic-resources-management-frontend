import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BisqueFiringListComponent } from './components/bisque-firing-list/bisque-firing-list.component';

const routes: Routes = [
  { path: '', component: BisqueFiringListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BisqueFiringRoutingModule { }
