export const cvThemes = ['peach', 'ocean', 'espresso', 'sage', 'slate', 'midnight'] as const;
export type CvTheme = (typeof cvThemes)[number];

// Edit this line to change the color scheme used on the site and in exports.
// Preview others without editing by adding ?theme=<name> to the URL.
export const activeTheme: CvTheme = 'peach';
