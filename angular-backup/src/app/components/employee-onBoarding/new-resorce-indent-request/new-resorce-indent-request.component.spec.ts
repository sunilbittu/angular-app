import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResorceIndentRequestComponent } from './new-resorce-indent-request.component';

describe('NewResorceIndentRequestComponent', () => {
  let component: NewResorceIndentRequestComponent;
  let fixture: ComponentFixture<NewResorceIndentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewResorceIndentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResorceIndentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
