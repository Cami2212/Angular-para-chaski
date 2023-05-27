/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DisputesService } from './disputes.service';

describe('Service: Disputes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisputesService]
    });
  });

  it('should ...', inject([DisputesService], (service: DisputesService) => {
    expect(service).toBeTruthy();
  }));
});
