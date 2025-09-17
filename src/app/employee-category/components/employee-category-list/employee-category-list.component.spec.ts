import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCategoryListComponent } from './employee-category-list.component';

describe('EmployeeCategoryListComponent', () => {
  let component: EmployeeCategoryListComponent;
  let fixture: ComponentFixture<EmployeeCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
