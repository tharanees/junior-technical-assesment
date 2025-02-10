import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { sanitizeProduct, sanitizeString } from '../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
/**
 * This service class simulates an API and we do not expect you to have to make any changes here.
 */
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Personal Loan',
      description: 'Flexible personal loans with competitive interest rates from 3.9% APR',
      department: 'Lending',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'First-Time Buyer Mortgage',
      description: 'Specialized mortgages for first-time buyers with deposits from 5%',
      department: 'Mortgages',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Rewards Credit Card',
      description: 'Premium credit card with 1% cashback and travel insurance benefits',
      department: 'Cards',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    // Simulate API delay
    return of([...this.products]).pipe(delay(500));
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product).pipe(delay(500));
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {

    // Sanitize the product data before validation
    const sanitizedProduct = sanitizeProduct(product);

    const validationErrors = this.validateProduct(sanitizedProduct);
    if (validationErrors.length > 0) {
      return throwError(() => ({
        status: 400,
        message: 'Validation failed',
        errors: validationErrors
      }));
    }

    const newProduct: Product = {
      ...sanitizedProduct,
      id: (this.products.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product | undefined> {

    // Sanitize the product data before validation
    const sanitizedProduct = sanitizeProduct(product);

    const index = this.products.findIndex(p => p.id === id);

    const validationErrors = this.validateProduct(sanitizedProduct, id);
    if (validationErrors.length > 0) {
      return throwError(() => ({
        status: 400,
        message: 'Validation failed',
        errors: validationErrors
      }));
    }

    if (index === -1) {
      return throwError(() => ({
        status: 404,
        message: 'Product not found'
      }));
    }

    const updatedProduct: Product = {
      ...this.products[index],
      ...sanitizedProduct,
      updatedAt: new Date()
    };
    this.products[index] = updatedProduct;
    return of(updatedProduct).pipe(delay(500));
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return of(false).pipe(delay(500));
    }

    this.products.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  protected validateProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    currentProductId?: string
  ): string[] {
    const validationErrors: string[] = [];

    // Since we have already sanitized the product, no extra trim() is needed here.
    if (!product.name) validationErrors.push('Name is required');
    if (!product.description) validationErrors.push('Description is required');
    if (!product.department) validationErrors.push('Department is required');
    
    // Ignore the product with currentProductId (if provided) to allow editing a product keeping its name unchanged
    if (this.products.some(p => 
      (currentProductId ? p.id !== currentProductId : true) &&
      sanitizeString(p.name).toLowerCase() === product.name.toLowerCase()
    )) {
      validationErrors.push('Product name must be unique');
    }

    return validationErrors;
  }
}
