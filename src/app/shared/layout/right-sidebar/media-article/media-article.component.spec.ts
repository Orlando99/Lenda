import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaArticleComponent } from './media-article.component';

describe('MediaArticleComponent', () => {
  let component: MediaArticleComponent;
  let fixture: ComponentFixture<MediaArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
