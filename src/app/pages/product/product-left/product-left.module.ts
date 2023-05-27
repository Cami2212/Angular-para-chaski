import { VendorStoreComponent } from './vendor-store/vendor-store.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { BoughtTogetherComponent } from './bought-together/bought-together.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductLeftComponent } from './product-left.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [ProductLeftComponent]
})
export class ProductLeftModule { }
