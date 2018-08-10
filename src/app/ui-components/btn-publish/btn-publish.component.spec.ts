import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnPublishComponent } from './btn-publish.component';

describe('BtnPublishComponent', () => {
  let component: BtnPublishComponent;
  let fixture: ComponentFixture<BtnPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
