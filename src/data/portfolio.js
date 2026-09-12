export const navLinks = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

export const projects = [
  {
    id: '01', name: 'EventEase', type: 'Campus operating system', categories: ['Web', 'Systems'], deviceType: 'web',
    description: 'A unified platform for discovering events and booking university spaces without the admin chaos.',
    tags: ['React', 'Node.js', 'MongoDB'], color: 'violet', mark: 'EE', metric: '48%', metricText: 'faster booking flow',
    screenshots: [
      '/images/event-ease/01.png', '/images/event-ease/02.png', '/images/event-ease/03.png', '/images/event-ease/04.png', '/images/event-ease/05.png', '/images/event-ease/06.png', '/images/event-ease/07.png', '/images/event-ease/08.png', '/images/event-ease/09.png', '/images/event-ease/10.png', '/images/event-ease/11.png', '/images/event-ease/12.png', '/images/event-ease/13.png', '/images/event-ease/14.png', '/images/event-ease/15.png', '/images/event-ease/16.png', '/images/event-ease/17.png',
    ],
  },
  {
    id: '02', name: 'Campus Vote', type: 'Verified student voting', categories: ['Mobile'], deviceType: 'mobile',
    description: 'A location-aware Android voting experience with secure student-ID scanning, campus geofencing, and broadcast updates for trusted election management.',
    tags: ['Java', 'Firebase', 'ML Kit', 'Geofencing', 'Broadcast Receiver'], color: 'blue', mark: 'CV', metric: '100%', metricText: 'identity verification',
    screenshots: [
      '/images/campus-vote/13-login.jpg', '/images/campus-vote/08-register.jpg', '/images/campus-vote/16-scan-id.jpg', '/images/campus-vote/01-profile.jpg', '/images/campus-vote/07-dashboard.jpg', '/images/campus-vote/12-live-dashboard.jpg', '/images/campus-vote/02-candidates.jpg', '/images/campus-vote/05-active-candidates.jpg', '/images/campus-vote/17-vote.jpg', '/images/campus-vote/14-geofence.jpg', '/images/campus-vote/06-results.jpg', '/images/campus-vote/03-documents.jpg', '/images/campus-vote/11-broadcasts.jpg', '/images/campus-vote/09-report.jpg', '/images/campus-vote/10-feedback.jpg', '/images/campus-vote/15-feedback-form.jpg', '/images/campus-vote/04-clear-data.jpg',
    ],
  },
  {
    id: '03', name: 'FinDesk', type: 'Finance administration', categories: ['Web', 'Systems'], deviceType: 'web',
    description: 'A responsive administration workspace that makes university finance operations clear and accountable.',
    tags: ['PHP', 'MySQL', 'Responsive UI'], color: 'orange', mark: 'FD', metric: '3x', metricText: 'quicker reporting',
    screenshots: [
      '/images/findesk/07-dashboard.png', '/images/findesk/03-create-goal.png', '/images/findesk/04-allocate-budget.png', '/images/findesk/05-view-budget-details.png', '/images/findesk/01-expenditure-bill.png', '/images/findesk/02-generated-bill.png', '/images/findesk/06-excel-report.png',
    ],
  },
  {
    id: '04', name: 'Smart Travel Mode', type: 'Android travel safety app', categories: ['Mobile'], deviceType: 'mobile',
    description: 'An Android app that detects airplane mode changes and sends travel-status alerts with an optional location link to trusted family members.',
    tags: ['Java', 'XML', 'Broadcast Receiver'], color: 'blue', mark: 'ST', metric: 'Auto', metricText: 'travel status alerts',
    screenshots: [
      '/images/smart-travel/06-setup.jpg', '/images/smart-travel/07-location-permission.jpg', '/images/smart-travel/01-map.jpg', '/images/smart-travel/02-boarding-notice.jpg', '/images/smart-travel/10-landed-status.jpg', '/images/smart-travel/05-landed-notice.jpg', '/images/smart-travel/08-sms-sent.jpg', '/images/smart-travel/03-email.jpg', '/images/smart-travel/09-message-history.jpg', '/images/smart-travel/04-settings.jpg',
    ],
  },
  {
    id: '05', name: 'Research Paper Management', type: 'Research catalogue dashboard', categories: ['Web', 'Systems'], deviceType: 'web',
    description: 'A full-stack research-paper management workspace where users can create, search, view, update, and delete paper records, with server-side pagination and PostgreSQL persistence.',
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'CRUD'], color: 'violet', mark: 'RP', metric: 'CRUD', metricText: 'full paper lifecycle',
    screenshots: [
      '/images/research-papers/05-list.jpg', '/images/research-papers/07-pagination.jpg', '/images/research-papers/03-create.jpg', '/images/research-papers/02-details.jpg', '/images/research-papers/01-edit.jpg', '/images/research-papers/04-delete.jpg', '/images/research-papers/06-postgresql.jpg',
    ],
  },
];

export const skillGroups = [
  { label: 'Frontend', skills: ['React', 'JavaScript', 'HTML / CSS', 'Responsive UI'] },
  { label: 'Programming', skills: ['Java', 'JavaScript', 'XML', 'PHP'] },
  { label: 'Backend', skills: ['Node.js', 'Express', 'REST APIs', 'Firebase'] },
  { label: 'Data', skills: ['MongoDB', 'MySQL', 'Firebase', 'PostgreSQL'] },
  { label: 'Tools', skills: ['Git', 'Figma', 'VS Code', 'Android Studio'] },
];

export const timeline = [
  { year: '2024 - 2026', title: 'MCA - Master of Computer Applications', place: 'Building deeper systems thinking through product-led engineering.', photos: ['/images/timeline/mca-semester-1.jpeg', '/images/timeline/mca-semester-2.jpeg', '/images/timeline/mca-semester-3.jpeg'] },
  { year: '2026 (Feb - June)', title: 'Programmer Trainee (E-Learning Associate)', place: 'Integra Software Services - 5 month professional experience.', photos: ['/images/timeline/integra-experience.jpeg'] },
  { year: '2025', title: 'Paper Presentation - JIGYASA 2025', place: 'Student coordinator for the Tech Nova paper-presentation event at Puducherry Technological University.', photos: ['/images/timeline/ptu-paper-presentation.jpeg'] },
  { year: '2023', title: 'Software Development Training', place: 'Askan Technologies - In-plant training in practical development.', photos: ['/images/timeline/askan-training.jpeg'] },
  { year: '2021 - 2024', title: 'BCA - Bachelor of Computer Applications', place: 'A foundation in software development and computer science.', photos: ['/images/timeline/bca-certificate.jpeg'] },
];
