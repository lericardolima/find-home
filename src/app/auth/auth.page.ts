import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {

  isLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  onLoginClick(): void {
    this.authService.login();
    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.loadingController.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1000);
      });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
  }

  onSwitchAuthModel(): void {
    this.isLogin = !this.isLogin;
  }

}
