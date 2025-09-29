import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryMasterComponent } from './industry-master.component';

describe('IndustryMasterComponent', () => {
  let component: IndustryMasterComponent;
  let fixture: ComponentFixture<IndustryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
