export interface Project {
  id: number;
  name: string;
  subtitle: string;
  year: string;
  tags: string;
  image: string;
  description: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'SPINE',
    subtitle: 'Single-player story rich action game for PC/PS5/Xbox Series',
    year: '2023–2025',
    tags: 'Action Game • Unreal Engine • Combat Systems',
    image: '/Рисунок1.png',
    description:
      'On SPINE, I worked as a Technical Game Designer on the core gameplay systems behind combat, movement, and execution mechanics.\nThe project combines fast-paced combat, parkour elements, and cinematic finishing moves into a cohesive system driven by player input and animation logic. My role was to ensure these elements functioned not only as separate features, but as a unified and scalable gameplay framework.\nThis work demonstrates how technical design brings creative gameplay concepts to life by transforming design intent into responsive, polished, and reliable interactive systems.',
    highlights: [
      'Fluid combat that blends movement and finishing actions into a seamless flow',
      'Parkour mechanics integrated directly into combat',
      'Context-driven finishing moves based on player state and situation',
      'Technical systems enabling expressive and cinematic gameplay',
    ],
  },
  {
    id: 2,
    name: 'ALIA',
    subtitle: 'Digital Twin • CRM Integration • Sales Platform',
    year: '2022–2023',
    tags: 'Digital Twin • Real-Time • CRM',
    image: '/Рисунок2.png',
    description:
      'My role: Lead Unreal Engine Developer for a large-scale digital twin of a premium residential development in Moscow.\nThe project was built as a real-time platform for interactive property exploration, real-time data access, and client communication. I was responsible for application architecture, core system implementation, and integration with the client\'s CRM.\nThe solution allowed users to view up-to-date property information, submit requests, and send email inquiries directly from the application, turning the visualization into a practical sales tool.\nI also worked closely with the client to refine requirements, propose new features, and align the system with real business workflows.',
    highlights: [
      'Lead developer responsible for application architecture and core systems',
      'Large-scale real-time digital twin platform',
      'CRM integration with live property data',
      'In-app request creation and email communication',
      'Close collaboration with the client and feature planning',
      'Production-ready solution supporting real sales workflows',
      'Developed for an award-winning residential development',
    ],
  },
  {
    id: 3,
    name: 'LEVEL GROUP ECOSYSTEM',
    subtitle: 'Real-Time Systems • Digital Twins • Hardware & Business Integration',
    year: '2022–2023',
    tags: 'Digital Twin • Multi-Platform • Hardware',
    image: '/2026-02-23_18-29-08.png',
    description:
      'Role: Unreal Engine Developer (team member)\nContributed to the development of a real-time digital twin ecosystem that combines multiple residential developments into a single interactive platform.\nAs part of the team, I worked on core application features, interaction logic, and system functionality, including tablet-based control for live client presentations.',
    highlights: [
      'Developed as part of a team on a multi-project digital twin ecosystem',
      'Unified platform for multiple residential developments',
      'Tablet-based remote control for client presentations',
      'Integration with a physical scale model',
      'Real-time synchronization between the digital application and physical hardware',
      'Designed for interactive use in sales environments',
    ],
  },
  {
    id: 4,
    name: 'DONSTROY',
    subtitle: 'Real-Time Systems • Digital Twins • Hardware & Business Integration',
    year: '2023–2024',
    tags: 'Digital Twin • UI Systems • Virtual Tour',
    image: '/2026-02-23_18-29-47.png',
    description:
      'Role: Unreal Engine Developer (team member)\nContributed to a large-scale interactive digital twin covering three premium residential developments within a unified platform.\nI was responsible for end-to-end UI development, including layout, interaction logic, and integration with backend systems. The interface was designed to support real-time property exploration and smooth navigation across the project.\nI also developed custom UI animations to improve clarity and visual feedback, and proposed and implemented a virtual tour feature to enhance the user experience and presentation capabilities.',
    highlights: [
      'End-to-end UI development (layout, interaction, and logic)',
      'Integration of UI with backend systems',
      'Custom UI animations and transitions',
      'Design and implementation of a virtual tour system',
      'Developed as part of a team on a large-scale project',
      'Interface optimized for real-time exploration and client presentations',
    ],
  },
];
