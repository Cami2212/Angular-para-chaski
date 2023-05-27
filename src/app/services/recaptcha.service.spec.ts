/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecaptchaService } from './recaptcha.service';

describe('Service: Recaptcha', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecaptchaService]
    });
  });

  it('should ...', inject([RecaptchaService], (service: RecaptchaService) => {
    expect(service).toBeTruthy();
  }));
});
