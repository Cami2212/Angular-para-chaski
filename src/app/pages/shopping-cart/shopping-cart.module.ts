import { ShoppingCartRoutingModule } from './shopping-cart-rounting.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart.component';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ShoppingCartRoutingModule,
    DataTablesModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType:'danger'
  }),
  ],
  declarations: [ShoppingCartComponent]
})
export class ShoppingCartModule { }
