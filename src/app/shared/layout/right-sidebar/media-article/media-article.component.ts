import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-media-article',
  templateUrl: './media-article.component.html',
  styleUrls: ['./media-article.component.scss']
})
export class MediaArticleComponent implements OnInit {
  @Input() text;
  @Input() icon;
  constructor() { }

  ngOnInit() {
  }

}
