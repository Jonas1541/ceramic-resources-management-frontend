import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeCategoryListComponent } from '../../../employee-category/components/employee-category-list/employee-category-list.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'costPerHour', 'createdAt', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.configureSorting();
    this.loadEmployees();
  }

  configureSorting(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'category': return item.categories.map(c => c.name).join(', ');
        default: return (item as any)[property];
      }
    };
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    });
  }

  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '400px',
      data: { employee: employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  openEmployeeCategoriesDialog(): void {
    this.dialog.open(EmployeeCategoryListComponent, {
      width: '1200px',
      maxWidth: '1200px'
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (err) => {
          if (err.status === 409) {
            alert('Não é possível deletar este funcionário pois ele possui registros associados.');
          } else {
            alert('Ocorreu um erro ao excluir o funcionário.');
          }
        }
      });
    }
  }
  getCategoryNames(employee: Employee): string {
    return employee.categories.map(c => c.name).join(', ');
  }
}