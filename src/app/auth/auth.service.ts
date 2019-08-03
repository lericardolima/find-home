import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = true;
  private currentUserId = 'abc';

  constructor() { }

  login(): void {
    this.authenticated = true;
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  logout(): void {
    this.authenticated = false;
  }

  get isUserAuthenticated(): boolean {
    return this.authenticated;
  }
}
