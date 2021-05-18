import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SteamIdPageComponent } from './steam-id-page/steam-id-page.component';
import { FriendSelectPageComponent } from './friend-select-page/friend-select-page.component';
import { GameViewPageComponent } from './game-view-page/game-view-page.component';

const routes: Routes = [
  { path: 'steam-id', component: SteamIdPageComponent },
  { path: 'friend-select', component: FriendSelectPageComponent },
  { path: 'game-view', component: GameViewPageComponent },
  { path: '', redirectTo: '/steam-id', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
