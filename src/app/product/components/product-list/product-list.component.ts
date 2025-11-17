import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ProductTransactionListComponent } from '../product-transaction-list/product-transaction-list.component';
import { ProductTypeListComponent } from '../../../product-type/components/product-type-list/product-type-list.component';
import { ProductLineListComponent } from '../../../product-line/components/product-line-list/product-line-list.component';
import { DecimalFormatPipe } from '../../../shared/pipes/decimal-format.pipe';
import { ProductReportComponent } from '../product-report/product-report.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    CurrencyPipe,
    DecimalFormatPipe
],
  providers: [ DecimalPipe ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'height', 'length', 'width', 'glazeQuantityPerUnit', 'weight', 'type', 'line', 'productStock', 'actions'];
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
      data: { product: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openTransactionList(productId: string): void {
    const dialogRef = this.dialog.open(ProductTransactionListComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      data: { productId: productId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadProducts();
    });
  }
  
  openReport(productId: string): void {
    this.dialog.open(ProductReportComponent, {
      minWidth: '80vw',
      maxWidth: '1200px',
      data: { productId: productId }
    });
  }

  openProductTypesDialog(): void {
    this.dialog.open(ProductTypeListComponent, {
      width: '600px'
    });
  }

  openProductLinesDialog(): void {
    this.dialog.open(ProductLineListComponent, {
      width: '600px'
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar este produto pois ele possui transações associadas.');
          }
        }
      });
    }
  }
}