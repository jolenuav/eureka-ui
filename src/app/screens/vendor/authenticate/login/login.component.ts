import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authenticate.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onLogin(): Promise<void> {
    const signIn = await this.authService.signIn(
      this.loginForm.controls.username.value,
      this.loginForm.controls.password.value
    );

    if (signIn) {
      this.router.navigate([
        pathRoute([
          CONSTANTS.routes.partner.main,
          CONSTANTS.routes.partner.orderList,
        ]),
      ]);
    }
  }
}
