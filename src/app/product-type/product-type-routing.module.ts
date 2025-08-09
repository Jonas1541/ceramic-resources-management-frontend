import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypeListComponent } from './components/product-type-list/product-type-list.component';

const routes: Routes = [
  { path: '', component: ProductTypeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductTypeRoutingModule { }
