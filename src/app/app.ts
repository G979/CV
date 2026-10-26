import { Component, ChangeDetectionStrategy, afterNextRender, computed, signal } from '@angular/core';
import { activeProfile } from './profiles/active';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css', './app.mobile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly profile = activeProfile;

  // Private contacts (the phone number) stay out of the public site and its
  // pre-rendered HTML. The PDF export opens the page with ?print to show them.
  // Switched on after the first browser render so hydration still matches.
  readonly showPrivate = signal(false);
  readonly contacts = computed(() =>
    this.profile.contact.filter((item) => !item.private || this.showPrivate()),
  );

  constructor() {
    afterNextRender(() => {
      if (new URLSearchParams(window.location.search).has('print')) {
        this.showPrivate.set(true);
      }
    });
  }
}
