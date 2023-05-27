import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';


const routes: Routes = [
  {path: 'home', redirectTo: '', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  }), PagesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
