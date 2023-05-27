import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  SearchBreadcrumbComponent,
} from './pages/search/search-breadcrumb/search-breadcrumb.component';
import {
  SearchShowcaseComponent,
} from './pages/search/search-showcase/search-showcase.component';
import { SearchComponent } from './pages/search/search.component';
import { StoreListComponent } from './pages/store-list/store-list.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    StoreListComponent,
    AppComponent,
    SearchComponent,
    SearchBreadcrumbComponent,
    SearchShowcaseComponent,

  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
