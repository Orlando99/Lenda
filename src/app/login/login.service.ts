import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Rx";
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment';

/**
 * Shared service for login
 */
@Injectable()
export class LoginService {
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private localStorageService: LocalStorageService) {
  }

  /**
   * Observable for login
   */
  public isLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  /**
   * This initiates the next login value for the subscribers
   * @param newValue boolean value to describe if login is successful or not
   */
  public login(newValue: boolean): void {
    this.isUserLoggedIn.next(newValue);
  }

  /**
   * Removes the stored local storage data
   * to clear the dirty values (not synced)
   */
  public removeDataFromLocalStorage() {
    this.localStorageService.clear(environment.loankey);
    this.localStorageService.clear(environment.collateralTables);
    this.localStorageService.clear(environment.syncRequiredItems);
  }
}
