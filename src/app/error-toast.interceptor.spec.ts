import { TestBed } from '@angular/core/testing';

import { ErrorToastInterceptor } from './error-toast.interceptor';

describe('ErrorToastInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorToastInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorToastInterceptor = TestBed.inject(ErrorToastInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
