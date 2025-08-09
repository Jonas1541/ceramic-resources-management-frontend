import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductLineListComponent } from './components/product-line-list/product-line-list.component';

const routes: Routes = [
  { path: '', component: ProductLineListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductLineRoutingModule { }
