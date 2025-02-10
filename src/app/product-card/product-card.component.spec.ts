import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../models/product.model';
import { By } from '@angular/platform-browser';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    department: 'Test Department',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = testProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details', () => {
    const nameElement = fixture.nativeElement.querySelector('h3');
    expect(nameElement.textContent).toContain(testProduct.name);
    const deptElement = fixture.nativeElement.querySelector('p.text-sm');
    expect(deptElement.textContent).toContain(testProduct.department);
    const descElement = fixture.nativeElement.querySelector('p.text-gray-700');
    expect(descElement.textContent).toContain(testProduct.description);
  });

  it('should emit edit event when Edit button is clicked', () => {
    jest.spyOn(component.edit, 'emit');
    const editButton = fixture.debugElement.query(By.css('button.text-blue-600'));
    editButton.triggerEventHandler('click', null);
    expect(component.edit.emit).toHaveBeenCalledWith(testProduct);
  });

  it('should emit delete event when Delete button is clicked', () => {
    jest.spyOn(component.delete, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('button.text-red-600'));
    deleteButton.triggerEventHandler('click', null);
    expect(component.delete.emit).toHaveBeenCalledWith(testProduct);
  });
});
