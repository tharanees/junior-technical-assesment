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
});
