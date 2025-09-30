import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicReportsComponent } from './esic-reports.component';

describe('EsicReportsComponent', () => {
  let component: EsicReportsComponent;
  let fixture: ComponentFixture<EsicReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsicReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsicReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
