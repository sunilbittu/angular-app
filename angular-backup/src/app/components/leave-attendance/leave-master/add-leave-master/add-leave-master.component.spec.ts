import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveMasterComponent } from './add-leave-master.component';

describe('AddLeaveMasterComponent', () => {
  let component: AddLeaveMasterComponent;
  let fixture: ComponentFixture<AddLeaveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaveMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
