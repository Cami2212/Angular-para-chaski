import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { HeaderPromotionComponent } from './header-promotion/header-promotion.component';
import { NewletterComponent } from './newletter/newletter.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [ HeaderComponent, HeaderMobileComponent, HeaderPromotionComponent, NewletterComponent, FooterComponent],
  exports:[ HeaderComponent, HeaderMobileComponent, HeaderPromotionComponent, NewletterComponent, FooterComponent]
})
export class SharedModule { }
