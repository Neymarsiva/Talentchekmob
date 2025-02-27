import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanToConnectPageRoutingModule } from './scan-to-connect-routing.module';

import { ScanToConnectPage } from './scan-to-connect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ScanToConnectPageRoutingModule
  ],
  declarations: [ScanToConnectPage]
})
export class ScanToConnectPageModule {}
