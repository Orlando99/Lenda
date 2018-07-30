import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgTooltipComponent } from './svg-tooltip.component';

describe('SvgTooltipComponent', () => {
  let component: SvgTooltipComponent;
  let fixture: ComponentFixture<SvgTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
