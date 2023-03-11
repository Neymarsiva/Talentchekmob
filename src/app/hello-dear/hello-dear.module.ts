import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelloDearPageRoutingModule } from './hello-dear-routing.module';

import { HelloDearPage } from './hello-dear.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelloDearPageRoutingModule
  ],
  declarations: [HelloDearPage]
})
export class HelloDearPageModule {}
