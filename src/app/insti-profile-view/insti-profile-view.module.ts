import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstiProfileViewPageRoutingModule } from './insti-profile-view-routing.module';

import { InstiProfileViewPage } from './insti-profile-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InstiProfileViewPageRoutingModule
  ],
  declarations: [InstiProfileViewPage]
})
export class InstiProfileViewPageModule {}
