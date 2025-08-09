import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { YearReport } from '../../models/year-report.model';
import { MonthReport } from '../../models/month-report.model';
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

  currentYear: number = new Date().getFullYear();
  yearReport: YearReport | null = null;
  displayedColumns: string[] = ['monthName', 'incomingQty', 'incomingCost', 'outgoingQty', 'outgoingProfit'];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.reportService.getYearReport(this.currentYear).subscribe((data: YearReport) => {
      this.yearReport = data;
    });
  }

  onYearChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.currentYear = Number(inputElement.value);
    this.loadReport();
  }
}
