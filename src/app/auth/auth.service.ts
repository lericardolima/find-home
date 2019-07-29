import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = false;

  constructor() { }

  login(): void {
    this.authenticated = true;
  }

  logout(): void {
    this.authenticated = false;
  }

  get isUserAuthenticated(): boolean {
    return this.authenticated;
  }
}
