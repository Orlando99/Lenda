import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Rx";

/**
 * Shared service for layout items - header, footer, sidebar
 */
@Injectable()
export class LayoutService {
  private isExpanded: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public isSidebarExpanded(): Observable<boolean> {
    return this.isExpanded.asObservable();
  }

  public toggleSidebar(newValue: boolean): void {
    this.isExpanded.next(newValue);
  }
}
