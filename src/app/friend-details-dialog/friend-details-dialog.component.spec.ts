import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendDetailsDialogComponent } from './friend-details-dialog.component';

describe('FriendDetailsDialogComponent', () => {
  let component: FriendDetailsDialogComponent;
  let fixture: ComponentFixture<FriendDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
