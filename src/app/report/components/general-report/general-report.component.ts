import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { GeneralReport } from '../../models/general-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-report',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, FormsModule, CurrencyPipe],
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss']
})
export class GeneralReportComponent implements OnInit {

  reports: GeneralReport[] = [];
  displayedColumns: string[] = ['monthName', 'incomingCost', 'outgoingProfit'];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.reportService.getGeneralReport().subscribe((data: GeneralReport[]) => {
      this.reports = data;
    });
  }
}
