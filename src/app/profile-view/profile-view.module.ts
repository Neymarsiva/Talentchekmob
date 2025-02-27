import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileViewPageRoutingModule } from './profile-view-routing.module';

import { ProfileViewPage } from './profile-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfileViewPageRoutingModule
  ],
  declarations: [ProfileViewPage]
})
export class ProfileViewPageModule {}
