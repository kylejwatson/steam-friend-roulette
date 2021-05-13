import { TestBed } from '@angular/core/testing';

import { SteamService } from './steam.service';

describe('FriendsService', () => {
  let service: SteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
