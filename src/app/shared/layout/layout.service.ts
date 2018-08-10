import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs";

/**
 * Shared service for layout items - header, footer, sidebar
 */
@Injectable()
export class LayoutService {
  private isExpanded: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private isRightbarExpanded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isSidebarExpanded(): Observable<boolean> {
    return this.isExpanded.asObservable();
  }

  public isRightSidebarExpanded(): Observable<boolean> {
    return this.isRightbarExpanded.asObservable();
  }

  public toggleSidebar(newValue: boolean): void {
    this.isExpanded.next(newValue);
  }

  public toggleRightSidebar(newValue: boolean): void {
    this.isRightbarExpanded.next(newValue);
  }
}
