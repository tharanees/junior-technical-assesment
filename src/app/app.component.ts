import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductCardComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'junior-technical-assesment';
  selectedProduct?: Product;
  products: Product[] = [];
  isLoading = false;
  errorMessage: string = '';

  // Reference to the product form so we can reset it on a successful product creation
  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  constructor(private productService: ProductService) {}

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
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error updating product';
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.errorMessage = '';
          // Reset form only on success
          if (this.productFormComponent) {
            this.productFormComponent.resetForm();
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error creating product';
          console.error('Error creating product:', error);
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
        }
      },
      error: (error) => console.error('Error deleting product:', error)
    });
  }

  onCancelForm(): void {
    this.selectedProduct = undefined;
  }
}
