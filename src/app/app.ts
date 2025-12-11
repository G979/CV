import { Component, ElementRef, ViewChild, computed, ChangeDetectionStrategy } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  readonly title = 'Frontend Developer | Software Developer | Blockchain Developer';
  readonly location = 'Athens, Greece 🇬🇷';
  readonly phone = '+30 694 442 8973';
  readonly email = 'g979design@gmail.com';
  readonly website = 'g979-personalsite.web.app';
  readonly github = 'github.com/G979';
  readonly photo = 'assets/CV.jpg';

  readonly headline = 'Making the web prettier, one component at a time';
  readonly summary = `I build web experiences that combine technical precision with creative flair. From blockchain platforms to real-time logistics systems, I thrive on turning complex problems into elegant, user-friendly solutions. Outside of development, you'll find me watching and playing sports, traveling to new places and experiment with digital art.`;

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
    'Copilot',
    'Ethereum',
    'Metamask',
    'Bootstrap',
    'Angular Flex',
    'Firebase',
    'Webpack',
    'Jira'
    
  ];

  readonly skills: Skill[] = [
    { name: 'Angular', level: 75, experience: '>5 years' },
    { name: 'React', level: 50, experience: '1 year' },
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
      role: 'Front-End Developer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Present',
      bullets: [
        'Led development of transfer platform processing 2K+ monthly transactions',
        'Built responsive Angular applications for 25+ transfer clients',
        'Improved client experience on 4 pre existed applications',
        'Mentored junior developers on Angular development'
      ]
    },
    {
      role: 'Front-End Developer',
      company: 'Elta Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Developed Angular + Python Flask logistics tracking platform serving company users',
        'Integrated 5+ third-party APIs for payments, mapping, and notifications',
        'Developed Single Angular web microservices for internal operations',
        'Developed Pure HMTL/CSS/JS landing pages for marketing campaigns'
      ]
    },
    {
      role: 'Junior Front-End Developer',
      company: 'Nostos Software Solutions',
      dates: 'Sep 2018 – Nov 2019',
      bullets: [
        'Help Develop a modulized ERP system for small companies using Angular and Node.j',
        'Help Develop Websites for companies and individuals with WordPress',
        'Help Develop Scaffolding Apps for betting purposes using Angular',
        'Help Creating and attending small workshops for Angular and TypeScript lessons'
      ]
    },
    {
      role: 'Freelance Web Developer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Ongoing',
      bullets: [
        'Delivered 10+ client projects with 100% satisfaction rating',
        'Specialized in custom web design & rapid prototyping',
        'Built progressive web apps increasing user engagement',
        'Provided technical consultation for using them'
      ]
    }
  ];

  readonly projects: Project[] = [
    {
      name: 'Transfer Platform',
      desc: 'Full-featured Angular platform for B2B payments with real-time tracking and reporting dashboard.',
      highlights: ['Angular 16+', 'RxJS', 'Material Design', 'REST APIs', 'PHP Laravel']
    },
    {
      name: 'Hotel Management Suite',
      desc: 'Web application for hotels handling bookings, rooms, and guest communications.',
      highlights: ['Angular', 'Node.js', 'PHP Laravel', 'PMS Integration']
    },
    {
      name: 'EC Refunds App',
      desc: 'Web application for managing EC refunds department for quicker resolving.',
      highlights: ['Angular', 'REST API', 'Python Flask', 'Real-time Updates']
    },
    {
      name: 'Health Data Blockchain',
      desc: 'Smart contract system for secure patient data sharing by using Ethereum network for security.',
      highlights: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'Security']
    },
    {
      name: 'Transfer Widget',
      desc: 'Embeddable widget enabling seamless transfer creation and processing integrated with the Transfer Platform.',
      highlights: ['Angular 16+', 'RxJS', 'Material Design', 'REST APIs', 'PHP Laravel']
    },
    {
      name: 'Youthfulguides',
      desc: 'An app to faciliate the connection between travelers and local guides in Greece',
      highlights: ['Angular 19+', 'RxJS', 'Material Design', 'REST APIs', 'Node.js']
    }
  ];

  async downloadPDF() {
    const element = this.cvContent.nativeElement;
    
    // Hide button during export
    const controls = document.querySelector('.controls') as HTMLElement;
    if (controls) controls.style.display = 'none';
    
    // Wait a moment for any transitions to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Maximum quality settings
    const options = {
      scale: 4, // Very high resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#f8f6f1',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
    };
    
    try {
      const canvas = await html2canvas(element, options);
      
      // Convert to high-quality image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      // Add pages as needed
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'NONE');
      heightLeft -= pageHeight;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'NONE');
        heightLeft -= pageHeight;
      }
      
      pdf.save('Georgios_Vasilakis_CV.pdf');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Show button again
      if (controls) controls.style.display = 'flex';
    }
  }
}
