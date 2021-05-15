import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  @Input() games: Game[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  convertGameTime(minutes: number): string {
    if (minutes === 0) {
      return "Never played";
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 1) {
      return "Played for less than an hour";
    }

    return `Played for ${hours} hours`;
  }

  scrollToTop(el: HTMLElement): void {
    el.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
}
