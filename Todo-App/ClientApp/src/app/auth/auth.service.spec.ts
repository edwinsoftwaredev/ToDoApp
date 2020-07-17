import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // What this method returns doesn't matter because the purpose of it is
  // to trigger the redirection to the signin page.
  // This method has to be tested in a e2e enviroment.
  /*it('startAuthentication() should return a Promise', () => {
    expect(service.startAuthentication()).toBeInstanceOf(Promise);
  });*/
});
