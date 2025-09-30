import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferletterRolloutComponent } from './offerletter-rollout.component';

describe('OfferletterRolloutComponent', () => {
  let component: OfferletterRolloutComponent;
  let fixture: ComponentFixture<OfferletterRolloutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferletterRolloutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferletterRolloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
