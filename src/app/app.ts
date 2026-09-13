import { Component, ChangeDetectionStrategy } from '@angular/core';
import { activeProfile } from './profiles/active';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly profile = activeProfile;
}
