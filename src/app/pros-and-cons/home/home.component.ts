import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProsAndConsService } from '../pros-and-cons.service';
import { ProsAndCons } from 'src/app/model/pros-and-cons.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public prosAndCons: ProsAndCons;
  public formPros: FormGroup;
  public formCons: FormGroup;
  public inProgress = false;
  private prosAndConsSubs = new Subscription();
  private updateMode = false;
  private upIndex: number;

  constructor(private prosAndConsService: ProsAndConsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.formPros = new FormGroup({
      pros: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.formCons = new FormGroup({
      cons: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.prosAndConsService.getProsAndCons();
    this.prosAndConsSubs = this.prosAndConsService.getProsAndConsUpdatedListener()
      .subscribe(data => {
        this.prosAndCons = data.prosAndCons;
        this.inProgress = false;
        this.formPros.reset();
        this.formCons.reset();
      });
  }

  ngOnDestroy() {
    this.prosAndConsSubs.unsubscribe();
  }

  onAddPro() {
    if (this.formPros.valid && !this.updateMode) {
      this.inProgress = true;
      this.prosAndConsService.addPros(this.formPros.value.pros);
    } else if (this.formPros.valid && this.updateMode) {
      this.inProgress = true;
      this.prosAndConsService.updatePro(this.formPros.value.pros, this.upIndex);
      this.updateMode = false;
    }
  }

  onAddCon() {
    if (this.formCons.valid && !this.updateMode) {
      this.inProgress = true;
      this.prosAndConsService.addCons(this.formCons.value.cons);
    } else if (this.formCons.valid && this.updateMode) {
      this.inProgress = true;
      this.prosAndConsService.updateCon(this.formCons.value.cons, this.upIndex);
      this.updateMode = false;
    }
  }

  onDeletePro(index: number) {
    this.inProgress = true;
    this.prosAndConsService.deletePros(index);
  }

  onDeleteCon(index: number) {
    this.inProgress = true;
    this.prosAndConsService.deleteCons(index);
  }

  onUpPro(pro: string, index: number) {
    this.updateMode = true;
    this.upIndex = index;
    this.formPros.setValue({
      pros: pro
    });
  }

  onUpCon(con: string, index: number) {
    this.updateMode = true;
    this.upIndex = index;
    this.formCons.setValue({
      cons: con
    });
  }

  onLogOut() {
    this.authService.logoutUser();
  }

}
