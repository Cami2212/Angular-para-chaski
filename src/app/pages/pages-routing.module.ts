import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import {
  AccountMyShoppingComponent,
} from '../pages/account/account-profile/account-my-shopping/account-my-shopping.component';
import { SearchComponent } from '../pages/search/search.component';
import { StoreListComponent } from '../pages/store-list/store-list.component';

const routes: Routes = [
  {path: '',  loadChildren:()=> import('../pages/home/home.module').then(m=>m.HomeModule)},
  {path: 'products',  loadChildren:()=> import('../pages/products/products.module').then(m=>m.ProductsModule)},
  {path: 'product', loadChildren:()=> import('../pages/product/product.module').then(m=>m.ProductModule)},
  {path: 'search/:param', component: SearchComponent},
  {path: 'login', loadChildren:()=> import('../pages/login/login.module').then(m=>m.LoginModule)},
  {path: 'register', loadChildren:()=> import('../pages/register/register.module').then(m=>m.RegisterModule)},
  {path: 'account', loadChildren:()=> import('../pages/account/account.module').then(m=>m.AccountModule),canActivate:[AuthGuard]},
  {path: 'shopping-cart',loadChildren:()=> import('../pages/shopping-cart/shopping-cart.module').then(m=>m.ShoppingCartModule)},
  {path: 'become-a-vendor',loadChildren:()=> import('../pages/become-a-vendor/become-a-vendor.module').then(m=>m.BecomeAVendorModule)},
  {path: 'store-list', component: StoreListComponent},
  {path: 'store-list/:param', component: StoreListComponent},
  {path: 'checkout', loadChildren:()=> import('../pages/checkout/checkout.module').then(m=>m.CheckoutModule), canActivate:[AuthGuard]},
  {path: 'my-shopping', component: AccountMyShoppingComponent, canActivate:[AuthGuard]},
  {path: '**', pathMatch:'full', loadChildren:()=> import('../pages/error404/error404.module').then(m=>m.Error404Module)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
