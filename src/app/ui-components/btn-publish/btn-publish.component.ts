import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PublishService, Page, Sync } from "../../services/publish.service";

@Component({
  selector: 'app-btn-publish',
  templateUrl: './btn-publish.component.html',
  styleUrls: ['./btn-publish.component.scss']
})
export class BtnPublishComponent implements OnInit {
  @Input() currentPageName: string;
  @Output() publishClicked = new EventEmitter();
  public isPublishEnabled: boolean = false;

  constructor(private publishService: PublishService) { }

  ngOnInit() {
    // Checks if current page is dirty for page header publish button
    this.publishService.listenToSyncRequired().subscribe((syncItems) => {
      this.isPublishEnabled = this._isPageSyncRequired(syncItems);
    });
  }

  /**
   * Publish button click
   */
  onClick() {
    this.publishClicked.emit();
  }

  // HELPERS
  // ===

  /**
   * Checks if currently active page requires synching
   * @param syncItems Array of sync pages
   */
  private _isPageSyncRequired(syncItems: Sync[]) {
    for (let item of syncItems) {
      if (item.page === this.currentPageName) {
        return true;
      }
    }
    return false;
  }
}
