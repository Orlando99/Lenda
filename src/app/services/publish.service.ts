import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment';

/**
 * Global service for publish button
 * ===
 * This service file detects if there are local edits on any page
 */
@Injectable()
export class PublishService {
  private static _syncRequired: BehaviorSubject<Sync[]> = new BehaviorSubject([]);
  private static _syncItems: Sync[] = [];

  constructor(public localStorageService: LocalStorageService) {
  }

  /**
   * Method to mark if page requires sync or not
   * @param pageName Name of page
   * @param isEnabled if sync is required or not
   */
  public enableSync(pageName: Page) {
    let sync = new Sync(pageName);
    this.syncRequiredOnPage(sync);
  }

  /**
   * Observable for checking if sync is required
   */
  public listenToSyncRequired(): Observable<Sync[]> {
    return PublishService._syncRequired.asObservable();
  }

  /**
   * Inform the subject that sync is required for this page
   * @param sync sync object containing page name and boolean value if sync is required or not
   */
  public syncRequiredOnPage(sync: Sync): void {
    let item = PublishService._syncItems.find((item) => {
      return sync.page === item.page
    });

    // If item already exists, update that otherwise make a new entry
    if (item) {
      item.isSyncRequired = sync.isSyncRequired;
    } else {
      PublishService._syncItems.push(sync);
    }

    // Push this on local storage
    this.localStorageService.store(environment.syncRequiredItems, PublishService._syncItems);

    // Trigger the change in subject
    PublishService._syncRequired.next(PublishService._syncItems);
  }

  /**
   * Sync complete event
   * ===
   * This marks the completion of sync event i.e. all pages are synched
   */
  public syncCompleted(): void {
    PublishService._syncItems = [];
    debugger
    this.localStorageService.store(environment.syncRequiredItems, PublishService._syncItems);
    PublishService._syncRequired.next(PublishService._syncItems);
  }
}

// HELPERS
// =======

/**
 * Sync class to check which page requires synching
 */
export class Sync {
  private _isSyncRequired: boolean = false;
  private _page: Page;

  constructor(page: Page, isSyncRequired: boolean = true) {
    this._page = page;
    this._isSyncRequired = isSyncRequired;
  }

  /**
   * Getter method to get current pagename
   */
  get page() {
    return this._page;
  }

  /**
   * Getter method for isSyncRequired for this page
   */
  get isSyncRequired() {
    return this._isSyncRequired;
  }

  /**
   * Setter method for isSyncRequired
   */
  set isSyncRequired(value) {
    this._isSyncRequired = value;
  }
}

/**
 * Pages in the app used by publish service for displaying
 * whether or not publish is required
 */
export enum Page {
  summary = 'summary',
  borrower = 'borrower',
  crop = 'crop',
  farm = 'farm',
  insurance = 'insurance',
  budget = 'budget',
  optimizer = 'optimizer',
  collateral = 'collateral',
  committee = 'committee',
  closing = 'closing',
  myPreferences = 'my preferences',
  favorites = 'favorites',
  flowchart = 'flowchart',
  workInProgress = 'work in progress',
  customEntry = 'custom entry'
}
