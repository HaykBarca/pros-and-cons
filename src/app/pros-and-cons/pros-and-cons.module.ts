import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { HomeComponent } from './home/home.component';
import { ProsAndConsRoutingModule } from './pros-and-cons-routing.module';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        ProsAndConsRoutingModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class ProsAndConsModule {}
