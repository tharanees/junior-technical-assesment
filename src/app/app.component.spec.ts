import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from './services/product.service';
import { NotificationService } from './services/notification.service';
import { Product } from './models/product.model';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productService: jest.Mocked<ProductService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      department: 'Test Department 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      department: 'Test Department 2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockProductService = {
    getProducts: jest.fn().mockReturnValue(of(mockProducts)),
    createProduct: jest.fn().mockImplementation((product) =>
      of({
        ...product,
        id: '3',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ),
    updateProduct: jest.fn().mockImplementation((id, product) =>
      of({
        ...product,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ),
    deleteProduct: jest.fn().mockReturnValue(of(true))
  };

  const mockNotificationService = {
    showSuccess: jest.fn(),
    showError: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ProductFormComponent, ProductCardComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.isLoading).toBe(false);
  }));

  it('should create a new product', fakeAsync(() => {
    const newProduct = {
      name: 'New Product',
      description: 'New Description',
      department: 'New Department'
    };

    component.onSaveProduct(newProduct);
    tick(500);

    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Product created successfully');
  }));

  it('should update an existing product', fakeAsync(() => {
    const updateData = {
      name: 'Updated Product',
      description: 'Updated Description',
      department: 'Updated Department'
    };

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct(updateData);
    tick(500);

    expect(productService.updateProduct).toHaveBeenCalledWith('1', updateData);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.selectedProduct).toBeUndefined();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Product updated successfully');
  }));

  it('should delete a product', fakeAsync(() => {
    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    expect(productService.getProducts).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Product deleted successfully');
  }));

  it('should set selected product when editing', () => {
    component.onEditProduct(mockProducts[0]);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should clear selected product when cancelling', () => {
    component.selectedProduct = mockProducts[0];
    component.onCancelForm();
    expect(component.selectedProduct).toBeUndefined();
  });

  it('should handle error when loading products', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.getProducts.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.ngOnInit();
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(notificationService.showError).toHaveBeenCalledWith('Error loading products');

    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when creating product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.createProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onSaveProduct({
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notificationService.showError).toHaveBeenCalledWith('Error creating product');

    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when updating product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.updateProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct({
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notificationService.showError).toHaveBeenCalledWith('Error updating product');

    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when deleting product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.deleteProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notificationService.showError).toHaveBeenCalledWith('Error deleting product');
    
    consoleErrorSpy.mockRestore();
  }));
});
