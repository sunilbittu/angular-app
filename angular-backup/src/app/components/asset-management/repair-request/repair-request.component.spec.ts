import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestComponent } from './repair-request.component';

describe('RepairRequestComponent', () => {
  let component: RepairRequestComponent;
  let fixture: ComponentFixture<RepairRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
