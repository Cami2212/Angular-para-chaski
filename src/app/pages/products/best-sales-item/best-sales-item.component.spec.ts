/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BestSalesItemComponent } from './best-sales-item.component';

describe('BestSalesItemComponent', () => {
  let component: BestSalesItemComponent;
  let fixture: ComponentFixture<BestSalesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestSalesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSalesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
