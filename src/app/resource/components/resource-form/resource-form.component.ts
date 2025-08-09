import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DecimalMaskDirective } from '../../../shared/directives/decimal-mask.directive';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, DecimalMaskDirective],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class ResourceFormComponent implements OnInit {

  resourceForm: FormGroup;
  isEditMode = false;
  categories = [
    { value: 'ELECTRICITY', viewValue: 'Eletricidade' },
    { value: 'WATER', viewValue: 'Água' },
    { value: 'GAS', viewValue: 'Gás' },
    { value: 'RAW_MATERIAL', viewValue: 'Matéria-prima' },
    { value: 'SILICATE', viewValue: 'Silicato' },
    { value: 'COMPONENT', viewValue: 'Componente' },
    { value: 'RETAIL', viewValue: 'Retalho' }
  ];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    public dialogRef: MatDialogRef<ResourceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resource: Resource }
  ) {
    this.resourceForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0.01)]]
    });

    if (data && data.resource) {
      this.isEditMode = true;
      this.resourceForm.patchValue(data.resource);
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      return;
    }

    const formData = this.resourceForm.value;

    if (this.isEditMode) {
      this.resourceService.updateResource(this.data.resource.id, formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.resourceService.createResource(formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
