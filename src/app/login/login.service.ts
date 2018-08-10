import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs";

/**
 * Shared service for login
 */
@Injectable()
export class LoginService {
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public isLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  public login(newValue: boolean): void {
    this.isUserLoggedIn.next(newValue);
  }
}
