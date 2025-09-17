import { Component } from '@angular/core';
import { EmployeeCategoryService } from '../../services/employee-category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeCategory } from '../../models/employee-category.model';
import { EmployeeCategoryFormComponent } from '../employee-category-form/employee-category-form.component';
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-category-list',
    imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule, DatePipe],
    templateUrl: './employee-category-list.component.html',
    styleUrl: './employee-category-list.component.scss'
})
export class EmployeeCategoryListComponent {

    displayedColumns: string[] = ['name', 'createdAt', 'updatedAt', 'actions'];
    employeeCategories: EmployeeCategory[] = [];

    constructor(
        private employeeCategoryService: EmployeeCategoryService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadEmployeeCategories();
    }

    loadEmployeeCategories(): void {
        this.employeeCategoryService.getEmployeeCategories().subscribe(data => {
            this.employeeCategories = data;
        });
    }

    openEmployeeCategoryForm(employeeCategory?: EmployeeCategory): void {
        const dialogRef = this.dialog.open(EmployeeCategoryFormComponent, {
            width: '400px',
            data: { employeeCategory: employeeCategory }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadEmployeeCategories();
            }
        });
    }

    deleteEmployeeCategory(id: string): void {
        if (confirm('Tem certeza que deseja excluir esta categoria de funcionário?')) {
            this.employeeCategoryService.deleteEmployeeCategory(id).subscribe({
                next: () => this.loadEmployeeCategories(),
                error: (err) => {
                    if (err.status === 409) {
                        alert('Não é possível deletar esta categoria de funcionário pois ela está sendo usada em funcionários.');
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
