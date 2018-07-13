import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-article',
  templateUrl: './user-article.component.html',
  styleUrls: ['./user-article.component.scss']
})
export class UserArticleComponent implements OnInit {
  @Input() title;
  @Input() text;
  @Input() date;
  constructor() { }

  ngOnInit() {
  }

}
