import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { Employee } from '../../../employee/models/employee.model';
import { EmployeeService } from '../../../employee/services/employee.service';
import { Glaze } from '../../../glaze/models/glaze.model';
import { GlazeService } from '../../../glaze/services/glaze.service';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { ProductService } from '../../../product/services/product.service';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { GlazeFiring } from '../../models/glaze-firing.model';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-glaze-firing-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatExpansionModule, MatCheckboxModule, DecimalMaskDirective, MatIconModule],
    templateUrl: './glaze-firing-form.component.html',
    styleUrls: ['./glaze-firing-form.component.scss']
})
export class GlazeFiringFormComponent implements OnInit {

    glazeFiringForm: FormGroup;
    isEditMode = false;
    groupedProducts = new Map<string, ProductTransaction[]>();
    glazes: Glaze[] = [];
    productTransactions: ProductTransaction[] = [];
    employees: Employee[] = [];
    glazeAssignments = new Map<string, string>(); // transactionId -> glazeId

    constructor(
        private fb: FormBuilder,
        private glazeFiringService: GlazeFiringService,
        private productService: ProductService,
        private glazeService: GlazeService,
        private employeeService: EmployeeService,
        public dialogRef: MatDialogRef<GlazeFiringFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { glazeFiring?: GlazeFiring, kilnId: string }
    ) {
        this.isEditMode = !!this.data.glazeFiring;
        this.glazeFiringForm = this.fb.group({
            temperature: [this.data.glazeFiring?.temperature || '', [Validators.required, Validators.min(0)]],
            burnTime: [this.data.glazeFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
            coolingTime: [this.data.glazeFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
            productTransactionIds: [[] as string[], [Validators.required, Validators.minLength(1)]],
            employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    ngOnInit(): void {
        this.loadEmployees();
        forkJoin({
            biscuitProducts: this.productService.getProductTransactions('1', 'BISCUIT'),
            glazes: this.glazeService.getGlazes()
        }).subscribe(({ biscuitProducts, glazes }) => {
            this.glazes = glazes;
            this.productTransactions = biscuitProducts;

            if (this.isEditMode && this.data.glazeFiring && this.data.glazeFiring.glosts.length > 0) {
                const existingProducts$ = forkJoin(
                    this.data.glazeFiring.glosts.map(g => this.productService.getProductTransactionById(g.productId, g.productTxId))
                );

                existingProducts$.subscribe(existingProducts => {
                    const allProducts = [...this.productTransactions, ...existingProducts];
                    this.productTransactions = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
                    
                    this.groupProducts(this.productTransactions);
                    this.populateFormForEdit();
                });
            } else {
                this.groupProducts(this.productTransactions);
            }
        });
    }

    loadEmployees(): void {
        this.employeeService.getEmployees().subscribe(data => {
            this.employees = data;
        });
    }

    private populateFormForEdit(): void {
        if (!this.data.glazeFiring) return;
        this.glazeFiringForm.patchValue({
            temperature: this.data.glazeFiring.temperature,
            burnTime: this.data.glazeFiring.burnTime,
            coolingTime: this.data.glazeFiring.coolingTime
        });
        this.productIdsControl.setValue(this.data.glazeFiring.glosts.map(g => g.productTxId));

        this.data.glazeFiring.glosts.forEach(glost => {
            this.glazeAssignments.set(glost.productTxId, glost.glazeId);
        });

        this.data.glazeFiring.employeeUsages.forEach(usage => {
            this.employeeUsages.push(this.fb.group({
                employeeId: [usage.employeeId, Validators.required],
                usageTime: [usage.usageTime, Validators.required]
            }));
        });
    }

    private groupProducts(transactions: ProductTransaction[]): void {
        this.groupedProducts.clear();
        transactions.forEach(transaction => {
            const key = transaction.productName;
            if (!this.groupedProducts.has(key)) {
                this.groupedProducts.set(key, []);
            }
            this.groupedProducts.get(key)!.push(transaction);
        });
    }

    setGlazeForAllInGroup(productGroup: ProductTransaction[], glazeId: string): void {
        productGroup.forEach(transaction => {
            this.glazeAssignments.set(transaction.id, glazeId);
        });
    }

    get productIdsControl(): FormControl {
        return this.glazeFiringForm.get('productTransactionIds') as FormControl;
    }

    get employeeUsages(): FormArray {
        return this.glazeFiringForm.get('employeeUsages') as FormArray;
    }

    addEmployeeUsage(): void {
        const employeeUsageForm = this.fb.group({
            employeeId: ['', Validators.required],
            usageTime: ['', Validators.required]
        });
        this.employeeUsages.push(employeeUsageForm);
    }

    removeEmployeeUsage(index: number): void {
        this.employeeUsages.removeAt(index);
    }

    getAvailableEmployees(currentIndex: number): Employee[] {
        const selectedEmployeeIds = this.employeeUsages.controls
            .map((control, index) => index === currentIndex ? null : control.get('employeeId')?.value)
            .filter(id => id !== null);
        return this.employees.filter(employee => !selectedEmployeeIds.includes(employee.id));
    }

    isAllSelected(productGroup: ProductTransaction[]): boolean {
        const selectedIds = this.productIdsControl.value as string[];
        return productGroup.every(p => selectedIds.includes(p.id));
    }

    isSomeSelected(productGroup: ProductTransaction[]): boolean {
        const selectedIds = this.productIdsControl.value as string[];
        const groupIds = productGroup.map(p => p.id);
        const intersection = groupIds.filter(id => selectedIds.includes(id));
        return intersection.length > 0 && intersection.length < groupIds.length;
    }

    toggleAllForGroup(productGroup: ProductTransaction[], event: any): void {
        const selectedIds = new Set<string>(this.productIdsControl.value);
        const groupIds = productGroup.map(p => p.id);
        if (event.checked) {
            groupIds.forEach(id => selectedIds.add(id));
        } else {
            groupIds.forEach(id => selectedIds.delete(id));
        }
        this.productIdsControl.setValue(Array.from(selectedIds));
    }

    toggleSelection(transactionId: string, event: any): void {
        const selectedIds = new Set<string>(this.productIdsControl.value);
        if (event.checked) {
            selectedIds.add(transactionId);
        } else {
            selectedIds.delete(transactionId);
        }
        this.productIdsControl.setValue(Array.from(selectedIds));
    }

    asIsOrder(a: any, b: any): number { return 1; }

    onCancel(): void { this.dialogRef.close(); }

    onSubmit(): void {
        if (this.glazeFiringForm.invalid) return;

        const formValue = this.glazeFiringForm.value;
        const glostsPayload: { productTransactionId: string; glazeId: string }[] = [];

        formValue.productTransactionIds.forEach((transactionId: string) => {
            const glazeId = this.glazeAssignments.get(transactionId);
            if (glazeId) {
                glostsPayload.push({ productTransactionId: transactionId, glazeId: glazeId });
            } 
        });

        if (glostsPayload.length !== formValue.productTransactionIds.length) {
            alert('Todas os produtos selecionados devem ter uma glasura atribuída.');
            return;
        }

        const payload = {
            temperature: parseFloat(String(formValue.temperature).replace(',', '.')),
            burnTime: parseFloat(String(formValue.burnTime).replace(',', '.')),
            coolingTime: parseFloat(String(formValue.coolingTime).replace(',', '.')),
            glosts: glostsPayload,
            employeeUsages: formValue.employeeUsages.map((usage: any) => ({
                ...usage,
                usageTime: parseFloat(String(usage.usageTime).replace(',', '.'))
            }))
        };

        const operation = this.isEditMode
            ? this.glazeFiringService.updateGlazeFiring(this.data.kilnId, this.data.glazeFiring!.id, payload)
            : this.glazeFiringService.createGlazeFiring(this.data.kilnId, payload);

        operation.subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => {
                const message = err.error?.message || (this.isEditMode ? 'Ocorreu um erro ao atualizar a queima.' : 'Ocorreu um erro ao criar a queima.');
                alert(message);
            }
        });
    }
}