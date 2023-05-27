import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeBrandsComponent } from './home-brands/home-brands.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import {
  HomeHotTodayComponent,
} from './home-hot-today/home-hot-today.component';
import {
  HomePromotionsComponent,
} from './home-promotions/home-promotions.component';
import { HomeRoutingModule } from './home-rounting.module';
import { HomeShowcaseComponent } from './home-showcase/home-showcase.component';
import {
  HomeTopCategoriesComponent,
} from './home-top-categories/home-top-categories.component';
import { HomeComponent } from './home.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, HomeBannerComponent, HomeBrandsComponent, HomeFeaturesComponent, HomePromotionsComponent, HomeShowcaseComponent, HomeHotTodayComponent, HomeTopCategoriesComponent, WhatsappComponent],
})
export class HomeModule { }
