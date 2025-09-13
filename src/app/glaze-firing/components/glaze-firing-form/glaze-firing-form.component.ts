import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlazeFiringService } from '../../services/glaze-firing.service';
import { GlazeFiring } from '../../models/glaze-firing.model';
import { ProductTransaction } from '../../../product/models/product-transaction.model';
import { ProductService } from '../../../product/services/product.service';
import { Glaze } from '../../../glaze/models/glaze.model';
import { GlazeService } from '../../../glaze/services/glaze.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-glaze-firing-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatExpansionModule, MatCheckboxModule, DecimalMaskDirective],
    templateUrl: './glaze-firing-form.component.html',
    styleUrls: ['./glaze-firing-form.component.scss']
})
export class GlazeFiringFormComponent implements OnInit {

    glazeFiringForm: FormGroup;
    isEditMode = false;
    groupedProducts = new Map<string, ProductTransaction[]>();
    glazes: Glaze[] = [];
    productTransactions: ProductTransaction[] = [];
    glazeAssignments = new Map<string, string>(); // transactionId -> glazeId

    constructor(
        private fb: FormBuilder,
        private glazeFiringService: GlazeFiringService,
        private productService: ProductService,
        private glazeService: GlazeService,
        public dialogRef: MatDialogRef<GlazeFiringFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { glazeFiring?: GlazeFiring, kilnId: string }
    ) {
        this.isEditMode = !!this.data.glazeFiring;
        this.glazeFiringForm = this.fb.group({
            temperature: [this.data.glazeFiring?.temperature || '', [Validators.required, Validators.min(0)]],
            burnTime: [this.data.glazeFiring?.burnTime || '', [Validators.required, Validators.min(0)]],
            coolingTime: [this.data.glazeFiring?.coolingTime || '', [Validators.required, Validators.min(0)]],
            productTransactionIds: [[] as string[], [Validators.required, Validators.minLength(1)]]
        });
    }

    ngOnInit(): void {
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
            glosts: glostsPayload
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