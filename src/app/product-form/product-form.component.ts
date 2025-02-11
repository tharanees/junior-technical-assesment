import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrimDirective } from '../directives/trim.directive';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TrimDirective],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnChanges {
  @Input() product?: Product;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      department: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        department: this.product.department
      });
    } else if (changes['product'] && !this.product) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.productForm.reset({
      name: '',
      description: '',
      department: ''
    });
  }

  shouldShowError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && (control.touched || this.isSubmitted) && control.errors);
  }
}
