import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.cancelEvent.emit();
  }
}
