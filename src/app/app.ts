import { Component, ChangeDetectionStrategy, afterNextRender, computed, signal } from '@angular/core';
import { activeProfile } from './profiles/active';
import { activeTheme, cvThemes, CvTheme } from './theme';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css', './cv-themes.css', './app.mobile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly profile = activeProfile;
  readonly theme = signal<CvTheme>(activeTheme);

  // Private contacts (the phone number) stay out of the public site and its
  // pre-rendered HTML. The PDF export opens the page with ?print to show them.
  // URL options are applied after the first browser render so hydration still matches.
  readonly showPrivate = signal(false);
  readonly contacts = computed(() =>
    this.profile.contact.filter((item) => !item.private || this.showPrivate()),
  );

  constructor() {
    afterNextRender(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('print')) {
        this.showPrivate.set(true);
      }
      const theme = params.get('theme');
      if (theme && (cvThemes as readonly string[]).includes(theme)) {
        this.theme.set(theme as CvTheme);
      }
    });
  }
}
