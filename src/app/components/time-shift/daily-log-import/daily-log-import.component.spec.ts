import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLogImportComponent } from './daily-log-import.component';

describe('DailyLogImportComponent', () => {
  let component: DailyLogImportComponent;
  let fixture: ComponentFixture<DailyLogImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyLogImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLogImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
