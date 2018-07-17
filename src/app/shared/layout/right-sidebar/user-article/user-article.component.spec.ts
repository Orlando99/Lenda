import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArticleComponent } from './user-article.component';

describe('UserArticleComponent', () => {
  let component: UserArticleComponent;
  let fixture: ComponentFixture<UserArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
