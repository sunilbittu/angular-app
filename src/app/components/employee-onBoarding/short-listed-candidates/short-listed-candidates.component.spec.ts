import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortListedCandidatesComponent } from './short-listed-candidates.component';

describe('ShortListedCandidatesComponent', () => {
  let component: ShortListedCandidatesComponent;
  let fixture: ComponentFixture<ShortListedCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortListedCandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortListedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
