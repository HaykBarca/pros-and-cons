import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public inProgress = false;
  private isAuthenticated: boolean;
  private userStatus = new Subscription();

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

    this.userStatus = this.authService.getUserStatus()
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;

        if  (!this.isAuthenticated) {
          this.inProgress = false;
          this.form.reset();
          this.form.get('groupId').markAsTouched();
          this.form.get('userId').markAsTouched();
        }
      });
  }

  ngOnDestroy() {
    this.userStatus.unsubscribe();
  }

  onLogin() {
    this.inProgress = true;
    this.authService.loginUser({groupId: this.form.value.groupId, userId: this.form.value.userId});
  }

}
