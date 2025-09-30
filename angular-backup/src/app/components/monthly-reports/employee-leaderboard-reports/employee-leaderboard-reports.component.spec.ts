import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaderboardReportsComponent } from './employee-leaderboard-reports.component';

describe('EmployeeLeaderboardReportsComponent', () => {
  let component: EmployeeLeaderboardReportsComponent;
  let fixture: ComponentFixture<EmployeeLeaderboardReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLeaderboardReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaderboardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
