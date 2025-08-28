import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilnReportComponent } from './kiln-report.component';

describe('KilnReportComponent', () => {
  let component: KilnReportComponent;
  let fixture: ComponentFixture<KilnReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KilnReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KilnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
