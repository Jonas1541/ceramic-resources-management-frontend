import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralReportComponent } from './components/general-report/general-report.component';

const routes: Routes = [
  { path: '', component: GeneralReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
