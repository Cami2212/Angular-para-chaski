import { BecomeAVendorComponent } from './become-a-vendor.component';
import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';


const routes: Routes = [
  {path: '',  component: BecomeAVendorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  BecomeAVendorRoutingModule { }
