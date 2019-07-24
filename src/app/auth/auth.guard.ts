import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService,
              private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const isUserAuthenticated: boolean = this.authService.isUserAuthenticated;
    if (!isUserAuthenticated) {
      this.router.navigateByUrl('/auth');
    }

    return isUserAuthenticated;
  }
}
