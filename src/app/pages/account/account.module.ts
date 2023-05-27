import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { DataTablesModule } from 'angular-datatables';
import { TagInputModule } from 'ngx-chips';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSummernoteModule } from 'ngx-summernote';
import { PipesModule } from 'src/app/pipes/pipes.module';

import {
  AccountBreadcrumbComponent,
} from './account-breadcrumb/account-breadcrumb.component';
import {
  AccountDisputesComponent,
} from './account-profile/account-disputes/account-disputes.component';
import {
  AccountMessagesComponent,
} from './account-profile/account-messages/account-messages.component';
import {
  AccountMySalesComponent,
} from './account-profile/account-my-sales/account-my-sales.component';
import {
  AccountMyShoppingComponent,
} from './account-profile/account-my-shopping/account-my-shopping.component';
import {
  AccountMyStoreComponent,
} from './account-profile/account-my-store/account-my-store.component';
import {
  AccountNewStoreComponent,
} from './account-profile/account-new-store/account-new-store.component';
import {
  AccountOrdersComponent,
} from './account-profile/account-orders/account-orders.component';
import {
  AccountProfileComponent,
} from './account-profile/account-profile.component';
import {
  AccountWishlistComponent,
} from './account-profile/account-wishlist/account-wishlist.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DataTablesModule,
    NgxDropzoneModule,
    TagInputModule,
    NgxSummernoteModule,
    ConfirmationPopoverModule.forRoot({confirmButtonType:'danger'}),
    PipesModule,
    AccountRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [AccountComponent, AccountProfileComponent, AccountBreadcrumbComponent, AccountMessagesComponent, AccountOrdersComponent,
    AccountMySalesComponent,
    AccountMessagesComponent,
    AccountDisputesComponent,
    AccountMyStoreComponent,
    AccountNewStoreComponent,
    AccountMyShoppingComponent,
    AccountWishlistComponent,]
})
export class AccountModule { }
