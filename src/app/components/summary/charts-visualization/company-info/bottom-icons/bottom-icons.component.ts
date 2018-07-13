import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bottom-icons',
  templateUrl: './bottom-icons.component.html',
  styleUrls: ['./bottom-icons.component.scss']
})
export class BottomIconsComponent implements OnInit {
  @Input() viewMode;
  constructor() { }

  ngOnInit() {
  }

}
