import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionTransferComponent } from './promotion-transfer.component';

describe('PromotionTransferComponent', () => {
  let component: PromotionTransferComponent;
  let fixture: ComponentFixture<PromotionTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
