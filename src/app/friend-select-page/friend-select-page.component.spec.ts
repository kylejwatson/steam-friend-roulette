import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSelectPageComponent } from './friend-select-page.component';

describe('FriendSelectPageComponent', () => {
  let component: FriendSelectPageComponent;
  let fixture: ComponentFixture<FriendSelectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendSelectPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
