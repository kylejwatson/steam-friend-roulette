import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieSnackbarComponent } from './cookie-snackbar.component';

describe('CookieSnackbarComponent', () => {
  let component: CookieSnackbarComponent;
  let fixture: ComponentFixture<CookieSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookieSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
