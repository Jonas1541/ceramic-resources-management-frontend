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
    productNameToIdMap: Map<string, string> = new Map();

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
            productGroups: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            employeeUsages: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    ngOnInit(): void {
        const sources = {
            employees: this.employeeService.getEmployees(),
            biscuitProducts: this.productService.getProductTransactions('1', 'BISCUIT'),
            glazes: this.glazeService.getGlazes(),
            products: this.productService.getProducts()
        };

        forkJoin(sources).subscribe(({ employees, biscuitProducts, glazes, products }) => {
            this.employees = employees;
            this.glazes = glazes;
            this.productTransactions = biscuitProducts;
            products.forEach(p => this.productNameToIdMap.set(p.name, p.id));

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
                if (this.isEditMode) {
                    this.populateFormForEdit();
                }
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

        const glostProductDetails = this.data.glazeFiring.glosts.map(glost => {
            const product = this.productTransactions.find(pt => pt.id === glost.productTxId);
            return { ...glost, productName: product?.productName || 'Unknown' };
        });

        const groupedByProductAndGlaze = glostProductDetails.reduce((acc, glost) => {
            const key = `${glost.productName}|${glost.glazeId}`;
            if (!acc[key]) {
                acc[key] = { productName: glost.productName, glazeId: glost.glazeId, quantity: 0 };
            }
            acc[key].quantity++;
            return acc;
        }, {} as Record<string, { productName: string, glazeId: string, quantity: number }>);

        (Object.values(groupedByProductAndGlaze) as { productName: string, glazeId: string, quantity: number }[]).forEach(item => {
            const groupIndex = this.productGroups.controls.findIndex(c => c.get('productName')?.value === item.productName);
            if (groupIndex !== -1) {
                const applications = this.glazeApplications(groupIndex);
                applications.push(this.fb.group({
                    glazeId: [item.glazeId, Validators.required],
                    quantity: [item.quantity, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]]
                }));
            }
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

        this.productGroups.clear();
        this.groupedProducts.forEach((value, key) => {
            this.productGroups.push(this.fb.group({
                productName: [key],
                glazeApplications: this.fb.array([])
            }));
        });
    }

    get productGroups(): FormArray {
        return this.glazeFiringForm.get('productGroups') as FormArray;
    }

    glazeApplications(groupIndex: number): FormArray {
        return this.productGroups.at(groupIndex).get('glazeApplications') as FormArray;
    }

    addGlazeApplication(groupIndex: number): void {
        const applications = this.glazeApplications(groupIndex);
        const group = this.productGroups.at(groupIndex);
        const productName = group.get('productName')?.value;
        const productTransactions = this.groupedProducts.get(productName) || [];
        
        const currentTotalQuantity = applications.controls.reduce((sum, control) => sum + (control.get('quantity')?.value || 0), 0);
        const remainingQuantity = productTransactions.length - currentTotalQuantity;

        if (remainingQuantity > 0) {
            applications.push(this.fb.group({
                glazeId: ['', Validators.required],
                quantity: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]]
            }));
        } else {
            alert(`Não há mais unidades de "${productName}" disponíveis para adicionar outra glasura.`);
        }
    }

    removeGlazeApplication(groupIndex: number, appIndex: number): void {
        this.glazeApplications(groupIndex).removeAt(appIndex);
    }

    getAvailableForProduct(groupIndex: number): number {
        const group = this.productGroups.at(groupIndex);
        const productName = group.get('productName')?.value;
        const productTransactions = this.groupedProducts.get(productName) || [];
        const applications = group.get('glazeApplications') as FormArray;
        const currentTotalQuantity = applications.controls.reduce((sum, control) => sum + (control.get('quantity')?.value || 0), 0);
        return productTransactions.length - currentTotalQuantity;
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

    asIsOrder(a: any, b: any): number { return 1; }

    onCancel(): void { this.dialogRef.close(); }

    onSubmit(): void {
        if (this.glazeFiringForm.invalid) {
            alert('O formulário contém erros. Por favor, verifique os campos.');
            return;
        }

        const formValue = this.glazeFiringForm.value;
        const glostsPayload: { productTransactionId: string; productId: string, glazeId: string }[] = [];
        let totalQuantity = 0;

        const availableProducts = new Map(Array.from(this.groupedProducts.entries()).map(([key, value]) => [key, [...value]]));

        for (const group of formValue.productGroups) {
            const productName = group.productName;
            const productTransactions = availableProducts.get(productName);
            const productId = this.productNameToIdMap.get(productName);
            if (!productTransactions || !productId) continue;

            let totalForProduct = 0;
            for (const app of group.glazeApplications) {
                totalForProduct += app.quantity;
            }
            if (totalForProduct > productTransactions.length) {
                alert(`A quantidade total para "${productName}" (${totalForProduct}) excede o estoque disponível (${productTransactions.length}).`);
                return;
            }

            for (const app of group.glazeApplications) {
                const quantity = app.quantity;
                const glazeId = app.glazeId;
                if (quantity > 0 && glazeId) {
                    const transactionsToAssign = productTransactions.splice(0, quantity);
                    transactionsToAssign.forEach(tx => {
                        glostsPayload.push({ productTransactionId: tx.id, productId: productId, glazeId: glazeId });
                    });
                    totalQuantity += quantity;
                }
            }
        }

        if (totalQuantity === 0) {
            alert('Pelo menos um produto deve ser selecionado para a queima.');
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