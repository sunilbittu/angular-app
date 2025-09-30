import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KPIMasterComponent } from './kpi-master.component';

describe('KPIMasterComponent', () => {
  let component: KPIMasterComponent;
  let fixture: ComponentFixture<KPIMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KPIMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KPIMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
