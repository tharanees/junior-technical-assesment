import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial products', fakeAsync(() => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(3);
      expect(products[0].name).toBe('Personal Loan');
    });
    tick(500);
  }));

  it('should create a new product', fakeAsync(() => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      department: 'Test Department'
    };

    service.createProduct(newProduct).subscribe((product: Product) => {
      expect(product.name).toBe(newProduct.name);
    });
    tick(500);
  }));

  it('should delete a product', fakeAsync(() => {
    service.deleteProduct('1').subscribe(success => {
      expect(success).toBe(true);
    });
    tick(500);
  }));

  it('should sanitize product fields before validation', fakeAsync(() => {
    const newProduct = {
      name: '  Test Product  ',
      description: '  Test Description  ',
      department: '  Test Department  '
    };

    service.createProduct(newProduct).subscribe((product: Product) => {
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.department).toBe('Test Department');
    });

    tick(500);
  }));

  it('should update a product successfully when the product name is unchanged', fakeAsync(() => {
    const updateData = {
      name: 'Personal Loan', // unchanged name
      description: 'Updated personal loan description',
      department: 'Lending'
    };

    service.updateProduct('1', updateData).subscribe((updatedProduct) => {
      expect(updatedProduct).toBeDefined();
      if (updatedProduct) {
        expect(updatedProduct.name).toBe('Personal Loan');
        expect(updatedProduct.description).toBe('Updated personal loan description');
      }
    });

    tick(500);
  }));

  it('should fail to update a product when the new product name duplicates an existing product', fakeAsync(() => {
    const updateData = {
      name: 'First-Time Buyer Mortgage', // duplicate of product 2
      description: 'Some description',
      department: 'Lending'
    };

    let errorResponse: any;
    service.updateProduct('1', updateData).subscribe({
      next: () => {},
      error: (err) => { errorResponse = err; }
    });
    tick(500);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.errors).toContain('Product name must be unique');
  }));
});
