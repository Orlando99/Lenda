import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomIconsComponent } from './bottom-icons.component';

describe('BottomIconsComponent', () => {
  let component: BottomIconsComponent;
  let fixture: ComponentFixture<BottomIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
