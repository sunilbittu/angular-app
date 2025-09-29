import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceChannelComponent } from './source-channel.component';

describe('SourceChannelComponent', () => {
  let component: SourceChannelComponent;
  let fixture: ComponentFixture<SourceChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
