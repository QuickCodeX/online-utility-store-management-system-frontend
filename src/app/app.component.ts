import { Component } from '@angular/core';
import { IdleService } from './core/idle.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet><app-toasts></app-toasts>`
})
export class AppComponent {
  constructor(idle: IdleService) {
    idle.start();   // NFR-009 inactivity sign-out
  }
}
