import { ProductsRecommendedComponent } from './products-recommended/products-recommended.component';
import { BestSalesItemComponent } from './best-sales-item/best-sales-item.component';
import { ProductsShowcaseComponent } from './products-showcase/products-showcase.component';
import { ProductsBreadcrumbComponent } from './products-breadcrumb/products-breadcrumb.component';
import { ProductsRountingModule } from './products-routing.module';
import { ProductsComponent } from '../products/products.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProductsRountingModule

  ],
  declarations: [ProductsComponent, ProductsBreadcrumbComponent, ProductsShowcaseComponent, BestSalesItemComponent, ProductsRecommendedComponent],
})

export class ProductsModule {

}
