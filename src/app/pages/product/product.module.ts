import { ProductRightComponent } from './product-right/product-right.component';
import { ProductLeftComponent } from './product-left/product-left.component';
import { ProductBreadcrumbComponent } from './product-breadcrumb/product-breadcrumb.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { RelatedProductComponent } from './related-product/related-product.component';
import { SimilarBoughtComponent } from './similar-bought/similar-bought.component';
import { RouterModule } from '@angular/router';
import { BoughtTogetherComponent } from './product-left/bought-together/bought-together.component';
import { ReviewsComponent } from './product-left/reviews/reviews.component';
import { VendorStoreComponent } from './product-left/vendor-store/vendor-store.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProductRoutingModule,
    PipesModule
  ],
  declarations: [ProductComponent, CallToActionComponent, ProductBreadcrumbComponent,ProductLeftComponent,ProductRightComponent,RelatedProductComponent,SimilarBoughtComponent,  BoughtTogetherComponent, ReviewsComponent, VendorStoreComponent]
})
export class ProductModule { }
