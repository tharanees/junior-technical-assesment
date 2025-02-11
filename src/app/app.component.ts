import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductCardComponent, MatSnackBarModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'junior-technical-assesment';
  selectedProduct?: Product;
  products: Product[] = [];
  isLoading = false;

  // Reference to the product form so we can reset it on a successful product creation
  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.showError('Error loading products');
        this.isLoading = false;
      }
    });
  }

  onSaveProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.selectedProduct = undefined;
          this.notificationService.showSuccess('Product updated successfully');
        },
        error: (error) => {
          console.error('Error updating product:', error);

          /**
           * NOTE: Can replace this with separate toast notifications that stack instead of rendering a single Angular Material’s snack bar 
           * with all validation errors joined with a `,`.
           */

          // Provide meaningful feedback depending on the validation error
          if (error.status === 400 && error.errors && error.errors.length > 0) {
            const validationMessage = error.errors.join(', ');
            this.notificationService.showError(validationMessage);
          } else if (error.status === 404) {
            this.notificationService.showError(error.message || 'Product not found');
          } else {
            this.notificationService.showError('Error updating product');
          }
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          // Reset form only on success
          if (this.productFormComponent) {
            this.productFormComponent.resetForm();
          }
          this.notificationService.showSuccess('Product created successfully');
        },
        error: (error) => {
          console.error('Error creating product:', error);

          // Provide meaningful feedback depending on the validation error
          if (error.status === 400 && error.errors && error.errors.length > 0) {
            const validationMessage = error.errors.join(', ');
            this.notificationService.showError(validationMessage);
          } else {
            this.notificationService.showError('Error creating product');
          }
        }
      });
    }
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
  }

  onDeleteProduct(product: Product): void {
    this.productService.deleteProduct(product.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadProducts();
          this.notificationService.showSuccess('Product deleted successfully');
        }
      },
      error: (error) => {
        console.error('Error deleting product:', error)
        this.notificationService.showError('Error deleting product');
      }
    });
  }

  onCancelForm(): void {
    this.selectedProduct = undefined;
  }
}
