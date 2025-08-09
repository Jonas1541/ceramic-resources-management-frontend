import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductLineService } from '../../services/product-line.service';
import { ProductLine } from '../../models/product-line.model';
import { ProductLineFormComponent } from '../product-line-form/product-line-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-line-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './product-line-list.component.html',
  styleUrls: ['./product-line-list.component.scss']
})
export class ProductLineListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  productLines: ProductLine[] = [];

  constructor(private productLineService: ProductLineService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProductLines();
  }

  loadProductLines(): void {
    this.productLineService.getProductLines().subscribe(data => {
      this.productLines = data;
    });
  }

  openProductLineForm(productLine?: ProductLine): void {
    const dialogRef = this.dialog.open(ProductLineFormComponent, {
      width: '400px',
      data: { productLine: productLine }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductLines();
      }
    });
  }

  deleteProductLine(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta linha de produto?')) {
      this.productLineService.deleteProductLine(id).subscribe({
        next: () => this.loadProductLines(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar esta linha de produto pois ela está sendo usada em produtos.');
          } else {
            alert(err.error.message);
          }
        }
      });
    }
  }

  onClose(): void {
    this.dialog.closeAll();
  }
}
