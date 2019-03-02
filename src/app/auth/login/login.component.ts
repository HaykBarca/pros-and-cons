import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public inProgress = false;
  private isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      groupId: new FormControl(null, {
        validators: [Validators.required]
      }),
      userId: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.isAuthenticated = this.authService.getIsAuth();
  }

  onLogin() {
    this.inProgress = true;
    this.authService.loginUser(this.form.value.groupId, this.form.value.userId);

    if (!this.isAuthenticated) {
      this.inProgress = false;
      this.form.reset();
    }
  }

}
