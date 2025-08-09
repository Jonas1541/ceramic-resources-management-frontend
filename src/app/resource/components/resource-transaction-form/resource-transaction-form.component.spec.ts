import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTransactionFormComponent } from './resource-transaction-form.component';

describe('ResourceTransactionFormComponent', () => {
  let component: ResourceTransactionFormComponent;
  let fixture: ComponentFixture<ResourceTransactionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTransactionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
