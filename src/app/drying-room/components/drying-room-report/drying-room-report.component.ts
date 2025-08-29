// src/app/drying-room/components/drying-room-report/drying-room-report.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DryingRoomService } from '../../services/drying-room.service';
import { YearReport } from '../../../report/models/year-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drying-room-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule, CurrencyPipe],
  templateUrl: './drying-room-report.component.html',
  styleUrls: ['./drying-room-report.component.scss']
})
export class DryingRoomReportComponent implements OnInit {

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
      y: { position: 'left', ticks: { color: '#616161', stepSize: 1 } },
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#009688' } } // Cor para o eixo de Custo
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
                label += context.parsed.y; // É uma contagem
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
    private dryingRoomService: DryingRoomService,
    public dialogRef: MatDialogRef<DryingRoomReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dryingRoomId: string }
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.dryingRoomService.getYearlyReport(this.data.dryingRoomId).subscribe((data: YearReport[]) => {
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
          label: 'Nº de Sessões de Secagem',
          data: report.months.map(m => m.incomingQty),
          backgroundColor: 'rgba(63, 81, 181, 0.7)', // Azul para as sessões
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Custo Total',
          data: report.months.map(m => m.incomingCost),
          borderColor: '#009688', // Ciano/Verde-azulado para o custo
          backgroundColor: 'rgba(0, 150, 136, 0.3)',
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