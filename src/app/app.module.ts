import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GameListComponent } from './game-list/game-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SteamIdPageComponent } from './steam-id-page/steam-id-page.component';
import { FriendSelectPageComponent } from './friend-select-page/friend-select-page.component';
import { GameViewPageComponent } from './game-view-page/game-view-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { CookieModule } from 'ngx-cookie';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoryListComponent } from './category-list/category-list.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorToastInterceptor } from './error-toast.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    FriendListComponent,
    GameListComponent,
    SteamIdPageComponent,
    FriendSelectPageComponent,
    GameViewPageComponent,
    LoadingOverlayComponent,
    CategoryListComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CookieModule.forRoot(),
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: Window, useValue: window },
    { provide: Document, useValue: document },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorToastInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
