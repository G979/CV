import { ContactPill, CvEducation } from './cv-profile.model';

export const baseIdentity = {
  name: 'Georgios Vasilakis',
  photo: 'assets/george.jpg',
  contact: [
    { label: '+30 694 442 8973', href: 'tel:+306944428973' },
    { label: 'g979design@gmail.com', href: 'mailto:g979design@gmail.com' },
    { label: 'Athens, Greece' },
    { label: 'github.com/G979', href: 'https://github.com/G979' },
    { label: 'linkedin.com/in/george-vasilakis', href: 'https://www.linkedin.com/in/george-vasilakis-057562292/' },
    { label: 'facebook.com/george.vasilakis1', href: 'https://www.facebook.com/george.vasilakis1' },
  ] as ContactPill[],
  education: {
    degree: 'B.Eng. Electrical & Computer Engineering',
    school: 'Technical University of Crete',
    // TODO: original data had no explicit graduation year, only this thesis note — replace with real dates if known.
    dates: 'Thesis: "Blockchain smart contract system for secure health data sharing"',
  } as CvEducation,
};
