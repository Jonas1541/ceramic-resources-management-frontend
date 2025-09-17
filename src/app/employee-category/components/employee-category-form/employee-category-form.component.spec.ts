import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCategoryFormComponent } from './employee-category-form.component';

describe('EmployeeCategoryFormComponent', () => {
  let component: EmployeeCategoryFormComponent;
  let fixture: ComponentFixture<EmployeeCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
