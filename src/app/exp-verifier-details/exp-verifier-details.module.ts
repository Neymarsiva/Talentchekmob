import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpVerifierDetailsPageRoutingModule } from './exp-verifier-details-routing.module';

import { ExpVerifierDetailsPage } from './exp-verifier-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ExpVerifierDetailsPageRoutingModule
  ],
  declarations: [ExpVerifierDetailsPage]
})
export class ExpVerifierDetailsPageModule {}
