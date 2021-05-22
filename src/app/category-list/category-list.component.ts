import { Component, Input, OnInit } from '@angular/core';
import { Category, Game } from '../game';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  @Input() categories: Category[] = [];
  @Input() games: Game[] = [];
  @Input() first = false;

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {
  }

  categoryDisabled(category: Category): boolean {
    return !this.steamService.gamesIncludeCategory(this.games, category);
  }

  setAll(category: Category, checked: boolean): void {
    category.subcategories?.forEach(sub => {
      sub.checked = checked;
      this.setAll(sub, checked);
    });
  }
  someChecked(category: Category): boolean {
    if (category.checked) {
      return false;
    }
    return !!category.subcategories?.some(sub => sub.checked);
  }
}
