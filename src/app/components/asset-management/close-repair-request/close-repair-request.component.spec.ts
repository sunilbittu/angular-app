import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRepairRequestComponent } from './close-repair-request.component';

describe('RepairRequestComponent', () => {
  let component: CloseRepairRequestComponent;
  let fixture: ComponentFixture<CloseRepairRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseRepairRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRepairRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
