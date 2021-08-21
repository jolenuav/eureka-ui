import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authenticate.service';
import { StoreService } from 'src/app/services/store/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: StoreService
  ) {}

  ngOnInit(): void {}

  async onLogin(): Promise<void> {
    this.store.startLoader();
    const signIn = await this.authService.signIn(
      this.loginForm.controls.username.value,
      this.loginForm.controls.password.value
    );

    if (signIn) {
      this.router.navigate([
        pathRoute([
          ROUTES.partner.main,
          ROUTES.partner.orderList,
        ]),
      ]);
    }
    this.store.endLoader();
  }
}
