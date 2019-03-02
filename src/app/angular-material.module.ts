import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
    exports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule
    ]
})
export class AngularMaterialModule {}
