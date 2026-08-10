import { Component, ElementRef, ViewChild, computed, ChangeDetectionStrategy } from '@angular/core';

interface Experience {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

interface Project {
  name: string;
  desc: string;
  link?: string;
  image?: string;
  highlights: string[];
}

interface Skill {
  name: string;
  level: number;
  experience?: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  @ViewChild('cvContent') cvContent!: ElementRef;

  readonly name = 'Georgios Vasilakis';
  readonly title = 'Frontend Developer | Software Engineer | Blockchain Engineer';
  readonly location = 'Athens, Greece 🇬🇷';
  readonly phone = '+30 694 442 8973';
  readonly email = 'g979design@gmail.com';
  readonly website = 'g979-personalsite.web.app';
  readonly github = 'github.com/G979';
  readonly photo = 'assets/george.jpg';

  readonly headline = 'Making the web prettier, one component at a time';
  readonly summary = `I'm a software and blockchain engineer based in Athens, with a background in Electrical & Computer Engineering. Over the past six years I've built platforms processing thousands of monthly B2B transactions, real-time logistics tracking systems, and Ethereum smart contracts for secure health data sharing — always aiming for that sweet spot where technical precision meets a genuinely enjoyable user experience. I've delivered 10+ freelance projects end-to-end, mentored junior developers, and led feature work on production platforms used by real clients every day. Outside of the editor, you'll find me watching or playing sports, planning my next trip, or experimenting with digital art.`;

  readonly String = String;

  readonly tools = [
    'Trello',
    'GitHub',
    'Bitbucket',
    'Zeplin',
    'Figma',
    'VS Code',
    'Postman',
    'Docker',
    'AWS',
    'Git',
    'DeepSeek',
    'ChatGPT',
    'GitHub Copilot',
    'Ethereum',
    'MetaMask',
    'Bootstrap',
    'Angular Flex-Layout',
    'Firebase',
    'Webpack',
    'Jira',
    'Claude',
    'PHP Laravel'
  ];

  readonly skills: Skill[] = [
    { name: 'Angular', level: 75, experience: '>5 years' },
    { name: 'React', level: 75, experience: '1 year' },
    { name: 'TypeScript', level: 75, experience: '>5 years' },
    { name: 'JavaScript', level: 75, experience: '>2 years' },
    { name: 'CSS/SCSS', level: 75, experience: '>5 years' },
    { name: 'Java', level: 50, experience: '2 years' },
    { name: 'C++', level: 50, experience: '1 year' },
    { name: 'Solidity', level: 50, experience: '1 year' },
    { name: 'WordPress', level: 75, experience: '>7 years' }
  ];

  readonly languages = [
    { name: 'Greek', level: 'Native' },
    { name: 'English', level: 'Fluent (ECPE C2)' },
    { name: 'German', level: 'Intermediate (B2)' }
  ];

  readonly education = {
    degree: 'B.Eng. Electrical & Computer Engineering',
    school: 'Technical University of Crete',
    year: 'Thesis: "Blockchain smart contract system for secure health data sharing"'
  };

  readonly experiences: Experience[] = [
    {
      role: 'Software Engineer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Present',
      bullets: [
        'Led development of a transfer platform processing 2,000+ monthly transactions',
        'Built responsive Angular and PHP Laravel applications for 100+ companies',
        'Improved client experience across 4 pre-existing applications',
        'Mentored junior developers through full frontend training'
      ]
    },
    {
      role: 'Front-End Developer',
      company: 'Elta Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Developed a React + Python Flask logistics tracking platform serving company users',
        'Integrated 5+ third-party APIs for payments, mapping, and notifications',
        'Built standalone Angular web microservices for internal operations',
        'Built HTML/CSS/JavaScript landing pages for marketing campaigns'
      ]
    },
    {
      role: 'Junior Front-End Developer',
      company: 'Nostos Software Solutions',
      dates: 'Sep 2018 – Nov 2019',
      bullets: [
        'Helped develop a modular ERP system for small companies using Angular and Node.js',
        'Helped develop websites for companies and individuals using WordPress',
        'Helped develop scaffolding apps for betting platforms using Angular',
        'Helped create and lead small workshops on Angular and TypeScript'
      ]
    },
    {
      role: 'Freelance Software Engineer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Ongoing',
      bullets: [
        'Delivered 10+ full-stack client projects with a 100% satisfaction rating',
        'Built full-stack web applications end-to-end, from Angular/React frontends to PHP Laravel backends',
        'Designed REST APIs and built progressive web apps that increased user engagement',
        'Provided ongoing technical consultation and support across the full development lifecycle'
      ]
    }
  ];

  readonly projects: Project[] = [
    {
      name: 'Transfer Platform',
      desc: 'Full-featured Angular platform for B2B payments with real-time tracking and a reporting dashboard.',
      highlights: ['Angular 16+', 'RxJS', 'Material Design', 'REST APIs', 'PHP Laravel']
    },
    {
      name: 'Hotel Management Suite',
      desc: 'Web application for hotels handling bookings, rooms, and guest communications.',
      highlights: ['Angular', 'Node.js', 'PHP Laravel', 'PMS Integration']
    },
    {
      name: 'EC Refunds App',
      desc: 'Web application for managing the EC refunds department for quicker resolution.',
      highlights: ['Angular', 'REST API', 'React', 'Python Flask', 'Real-time Updates']
    },
    {
      name: 'Health Data Blockchain',
      desc: 'Smart contract system for secure patient data sharing, using the Ethereum network for security.',
      highlights: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'Security']
    },
    {
      name: 'Transfer Widget',
      desc: 'Embeddable widget enabling seamless transfer creation and processing, integrated with the Transfer Platform.',
      highlights: ['Angular 16+', 'RxJS', 'Material Design', 'REST APIs', 'PHP Laravel']
    },
    {
      name: 'Youthfulguides',
      desc: 'An app to facilitate the connection between travelers and local guides in Greece.',
      highlights: ['Angular 19+', 'RxJS', 'Material Design', 'REST APIs', 'Node.js']
    }
  ];

  downloadPDF() {
    const element = this.cvContent.nativeElement;
    
    // Create print window
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow pop-ups to export PDF');
      return;
    }

    // Get all stylesheets
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // External stylesheets might throw CORS errors
          return '';
        }
      })
      .join('\n');

    // Clone the content
    const htmlContent = element.innerHTML;
    
    // Create complete document with all styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Georgios Vasilakis - CV</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
          <style>
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            
            ${styles}
            
            .controls {
              display: none !important;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            @media print {
              body, html {
                margin: 0 !important;
                padding: 0 !important;
              }
              .cv-wrapper {
                padding: 20px !important;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content and images to load
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
}
