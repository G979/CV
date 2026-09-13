export interface ContactPill {
  label: string;
  href?: string;
}

export interface CvExperience {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface CvEducation {
  degree: string;
  school: string;
  dates: string;
}

export interface CvCertification {
  name: string;
  issuer: string;
  date: string;
}

export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvProfile {
  id: string;
  name: string;
  photo: string;
  jobTitle: string;
  summary: string;
  contact: ContactPill[];
  education: CvEducation;
  experience: CvExperience[];
  certifications?: CvCertification[];
  skills: string[];
  languages?: CvLanguage[];
}
