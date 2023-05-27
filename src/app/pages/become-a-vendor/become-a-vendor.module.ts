import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecomeAVendorComponent } from './become-a-vendor.component';
import { BecomeAVendorRoutingModule } from './become-a-vendor-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BecomeAVendorRoutingModule
  ],
  declarations: [BecomeAVendorComponent]
})
export class BecomeAVendorModule { }
