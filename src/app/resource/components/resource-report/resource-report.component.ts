import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { YearReport } from '../../../report/models/year-report.model';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
// Imports adicionais para o seletor de ano
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule, CurrencyPipe],
  providers: [DecimalPipe],
  templateUrl: './resource-report.component.html',
  styleUrls: ['./resource-report.component.scss']
})
export class ResourceReportComponent implements OnInit {

  allReports: YearReport[] = [];
  selectedReport: YearReport | undefined;
  availableYears: number[] = [];
  selectedYear: number | undefined;
  isLoading = true; // Adiciona a flag de carregamento

  // Agora temos apenas o gráfico mensal, e ele não é mais um array
  public monthlyChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  public monthlyChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { position: 'left', ticks: { color: '#616161' } },
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#A10A28' } }
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
                label += new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(context.parsed.y) + ' kg';
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
    private resourceService: ResourceService,
    public dialogRef: MatDialogRef<ResourceReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resourceId: string }
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.resourceService.getYearlyReport(this.data.resourceId).subscribe((data: YearReport[]) => {
      this.allReports = data;
      this.availableYears = data.map(r => r.year).sort((a, b) => b - a); // Ordena do mais novo para o mais velho
      // Seleciona o ano mais recente por padrão
      if (this.availableYears.length > 0) {
        this.selectedYear = this.availableYears[0];
        this.onYearChange();
      }
      this.isLoading = false; // Finaliza o carregamento
    });
  }

  // Função chamada quando o usuário troca o ano no seletor
  onYearChange(): void {
    this.selectedReport = this.allReports.find(r => r.year === this.selectedYear);
    if (this.selectedReport) {
      this.prepareChartData(this.selectedReport);
    }
  }

  // Agora prepara dados apenas para o gráfico mensal do ano selecionado
  prepareChartData(report: YearReport): void {
    this.monthlyChartData = {
      labels: report.months.map(m => m.monthName),
      datasets: [
        {
          type: 'bar',
          label: 'Quantidade de Entrada',
          data: report.months.map(m => m.incomingQty),
          backgroundColor: 'rgba(90, 164, 84, 0.7)',
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Quantidade de Saída',
          data: report.months.map(m => m.outgoingQty),
          backgroundColor: 'rgba(63, 81, 181, 0.7)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Custo de Entrada',
          data: report.months.map(m => m.incomingCost),
          borderColor: '#A10A28',
          backgroundColor: 'rgba(161, 10, 40, 0.3)',
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