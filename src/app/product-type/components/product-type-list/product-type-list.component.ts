import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../models/product-type.model';
import { ProductTypeFormComponent } from '../product-type-form/product-type-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-type-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './product-type-list.component.html',
  styleUrls: ['./product-type-list.component.scss']
})
export class ProductTypeListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  productTypes: ProductType[] = [];

  constructor(private productTypeService: ProductTypeService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.productTypeService.getProductTypes().subscribe(data => {
      this.productTypes = data;
    });
  }

  openProductTypeForm(productType?: ProductType): void {
    const dialogRef = this.dialog.open(ProductTypeFormComponent, {
      width: '400px',
      data: { productType: productType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductTypes();
      }
    });
  }

  deleteProductType(id: string): void {
    if (confirm('Tem certeza que deseja excluir este tipo de produto?')) {
      this.productTypeService.deleteProductType(id).subscribe({
        next: () => this.loadProductTypes(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar este tipo de produto pois ele está sendo usado em produtos.');
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
