import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceTransactionFormComponent } from '../resource-transaction-form/resource-transaction-form.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { TranslateResourceCategoryPipe } from '../../../shared/pipes/translate-resource-category.pipe';

import { ResourceTransactionListComponent } from '../resource-transaction-list/resource-transaction-list.component';

import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, MatOptionModule, CurrencyPipe, TranslateResourceCategoryPipe, DecimalFormatPipe],
  providers: [DecimalPipe],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {

  basicDisplayedColumns: string[] = ['name', 'category', 'unitValue', 'actions'];
  ceramicDisplayedColumns: string[] = ['name', 'category', 'unitValue', 'currentQuantity', 'currentQuantityPrice', 'actions'];
  basicResources: Resource[] = [];
  ceramicResources: Resource[] = [];

  constructor(
    private resourceService: ResourceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe(data => {
      this.basicResources = data.filter(r => [
        'ELECTRICITY',
        'WATER',
        'GAS'
      ].includes(r.category));
      this.ceramicResources = data.filter(r => ![
        'ELECTRICITY',
        'WATER',
        'GAS'
      ].includes(r.category));
    });
  }

  openResourceForm(resource?: Resource): void {
    const dialogRef = this.dialog.open(ResourceFormComponent, {
      width: '400px',
      data: { resource: resource }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadResources();
      }
    });
  }

  openTransactionList(resourceId: string): void {
    this.dialog.open(ResourceTransactionListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { resourceId: resourceId }
    });
  }

  deleteResource(id: string): void {
    if (confirm('Tem certeza que deseja excluir este recurso?')) {
      this.resourceService.deleteResource(id).subscribe({
        next: () => this.loadResources(),
        error: (err: any) => {
          if (err.status === 409) {
            alert('Não é possível deletar este recurso pois ele possui transações associadas.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }
}