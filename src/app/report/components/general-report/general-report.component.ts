import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { GeneralReport } from '../../models/general-report.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-general-report',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, FormsModule, BaseChartDirective, CurrencyPipe],
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss']
})
export class GeneralReportComponent implements OnInit {

  reports: GeneralReport[] = [];
  isLoading: boolean = true;

  public lineChartData: ChartConfiguration<'line'>['data'][] = [];
  public annualChartData: ChartConfiguration<'bar'>['data'][] = [];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };
  public lineChartLegend = true;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartData: ChartConfiguration<'bar'>['data'][] = [];
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };
  public barChartLegend = true;

  constructor(private reportService: ReportService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.chart?.update();
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.reportService.getGeneralReport().subscribe((data: GeneralReport[]) => {
      this.reports = data;
      this.prepareChartData();
      this.isLoading = false;
    });
  }

  prepareChartData(): void {
    this.lineChartData = this.reports.map(report => {
      return {
        labels: report.months.map(m => m.monthName),
        datasets: [
          {
            data: report.months.map(m => m.incomingCost),
            label: 'Custo',
            borderColor: '#A10A28',
            backgroundColor: 'rgba(161, 10, 40, 0.3)'
          },
          {
            data: report.months.map(m => m.outgoingProfit),
            label: 'Faturamento',
            borderColor: '#5AA454',
            backgroundColor: 'rgba(90, 164, 84, 0.3)'
          }
        ]
      };
    });

    this.barChartData = this.reports.map(report => {
      return {
        // A etiqueta do eixo X agora pode ser apenas o ano, para maior clareza
        labels: [report.year.toString()], 
        datasets: [
          // Dataset #1: Apenas para o Custo
          {
            data: [report.totalIncomingCost],
            label: 'Custo Total', // Legenda correta
            backgroundColor: '#A10A28'
          },
          // Dataset #2: Apenas para o Faturamento
          {
            data: [report.totalOutgoingProfit],
            label: 'Faturamento Total', // Legenda correta
            backgroundColor: '#5AA454'
          }
        ]
      };
    });
  }
}