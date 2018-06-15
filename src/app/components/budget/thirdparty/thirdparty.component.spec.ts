import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdpartyComponent } from './thirdparty.component';

describe('ThirdpartyComponent', () => {
  let component: ThirdpartyComponent;
  let fixture: ComponentFixture<ThirdpartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdpartyComponent ]
    })
    .compileComponents();
  }));
 
  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdpartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
