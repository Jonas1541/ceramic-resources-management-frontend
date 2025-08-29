import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { BatchService } from '../../services/batch.service';
import { YearReport } from '../../../report/models/year-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule, CurrencyPipe],
  templateUrl: './batch-report.component.html',
  styleUrls: ['./batch-report.component.scss']
})
export class BatchReportComponent implements OnInit {

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
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#795548' } }
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
                label += `${context.parsed.y.toFixed(2)} kg`;
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
    private batchService: BatchService,
    public dialogRef: MatDialogRef<BatchReportComponent>
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.batchService.getYearlyReport().subscribe((data: YearReport[]) => {
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
          label: 'Qtd. de Recursos Usada',
          data: report.months.map(m => m.incomingQty),
          backgroundColor: 'rgba(90, 164, 84, 0.7)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Custo Mensal',
          data: report.months.map(m => m.incomingCost),
          borderColor: '#795548',
          backgroundColor: 'rgba(121, 85, 72, 0.3)',
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