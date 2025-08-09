import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KilnListComponent } from './components/kiln-list/kiln-list.component';

const routes: Routes = [
  { path: '', component: KilnListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KilnRoutingModule { }
