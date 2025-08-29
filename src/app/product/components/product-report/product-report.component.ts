// src/app/product/components/product-report/product-report.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { YearReport } from '../../../report/models/year-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule, CurrencyPipe],
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {

  allReports: YearReport[] = [];
  selectedReport: YearReport | undefined;
  availableYears: number[] = [];
  selectedYear: number | undefined;
  isLoading = true;

  public monthlyChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  public monthlyChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { position: 'left', ticks: { color: '#616161' } },
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#FB8C00' } }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar' | 'line'>) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) {
              if (context.dataset.type === 'line') {
                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
              } else {
                label += `${context.parsed.y} unidades`;
              }
            }
            return label;
          }
        }
      }
    }
  };
  public monthlyChartLegend = true;

  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string }
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.productService.getYearlyReport(this.data.productId).subscribe((data: YearReport[]) => {
      this.allReports = data;
      this.availableYears = data.map(r => r.year).sort((a, b) => b - a);
      if (this.availableYears.length > 0) {
        this.selectedYear = this.availableYears[0];
        this.onYearChange();
      }
      this.isLoading = false;
    });
  }

  onYearChange(): void {
    this.selectedReport = this.allReports.find(r => r.year === this.selectedYear);
    if (this.selectedReport) {
      this.prepareChartData(this.selectedReport);
    }
  }

  prepareChartData(report: YearReport): void {
    this.monthlyChartData = {
      labels: report.months.map(m => m.monthName),
      datasets: [
        {
          type: 'bar',
          label: 'Produção',
          data: report.months.map(m => m.incomingQty),
          backgroundColor: 'rgba(90, 164, 84, 0.7)',
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Saídas',
          data: report.months.map(m => m.outgoingQty),
          backgroundColor: 'rgba(63, 81, 181, 0.7)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Lucro',
          data: report.months.map(m => m.outgoingProfit),
          borderColor: '#FB8C00',
          backgroundColor: 'rgba(251, 140, 0, 0.3)',
          yAxisID: 'y1',
          tension: 0.2
        }
      ]
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }
}