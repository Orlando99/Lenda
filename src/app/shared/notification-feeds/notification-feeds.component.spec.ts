import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFeedsComponent } from './notification-feeds.component';

describe('NotificationFeedsComponent', () => {
  let component: NotificationFeedsComponent;
  let fixture: ComponentFixture<NotificationFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
