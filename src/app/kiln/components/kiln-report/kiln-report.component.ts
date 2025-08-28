// src/app/kiln/components/kiln-report/kiln-report.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { KilnService } from '../../services/kiln.service';
import { YearReport } from '../../../report/models/year-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kiln-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule, CurrencyPipe],
  templateUrl: './kiln-report.component.html',
  styleUrls: ['./kiln-report.component.scss']
})
export class KilnReportComponent implements OnInit {

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
      y: { position: 'left', ticks: { color: '#616161', stepSize: 1 } }, // Eixo para Contagem (Nº de Queimas)
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#3f51b5' } } // Eixo para Custo (R$)
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
                label += context.parsed.y; // Sem unidade, é uma contagem
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
    private kilnService: KilnService,
    public dialogRef: MatDialogRef<KilnReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kilnId: string }
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.kilnService.getYearlyReport(this.data.kilnId).subscribe((data: YearReport[]) => {
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
          label: 'Nº de Queimas',
          data: report.months.map(m => m.incomingQty), // Mapeando para o número de queimas
          backgroundColor: 'rgba(251, 140, 0, 0.7)',  // Laranja para queimas
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Custo Total (R$)',
          data: report.months.map(m => m.incomingCost), // Mapeando para o custo das queimas
          borderColor: '#3f51b5',                       // Azul para custo
          backgroundColor: 'rgba(63, 81, 181, 0.3)',
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