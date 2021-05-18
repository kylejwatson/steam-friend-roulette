import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamIdPageComponent } from './steam-id-page.component';

describe('SteamIdPageComponent', () => {
  let component: SteamIdPageComponent;
  let fixture: ComponentFixture<SteamIdPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteamIdPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamIdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
