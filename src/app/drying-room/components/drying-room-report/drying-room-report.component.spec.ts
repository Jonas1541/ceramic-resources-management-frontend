import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DryingRoomReportComponent } from './drying-room-report.component';

describe('DryingRoomReportComponent', () => {
  let component: DryingRoomReportComponent;
  let fixture: ComponentFixture<DryingRoomReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DryingRoomReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DryingRoomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
