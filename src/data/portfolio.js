const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const navLinks = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

export const projects = [
  {
    id: '01',
    name: 'EventEase',
    type: 'Campus operating system',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A unified platform for discovering events and booking university spaces without the admin chaos.',
    tags: ['React', 'Node.js', 'MongoDB'],
    color: 'violet',
    mark: 'EE',
    metric: '48%',
    metricText: 'faster booking flow',
    screenshots: [
      asset('/images/event-ease/01.png'),
      asset('/images/event-ease/02.png'),
      asset('/images/event-ease/03.png'),
      asset('/images/event-ease/04.png'),
      asset('/images/event-ease/05.png'),
      asset('/images/event-ease/06.png'),
      asset('/images/event-ease/07.png'),
      asset('/images/event-ease/08.png'),
      asset('/images/event-ease/09.png'),
      asset('/images/event-ease/10.png'),
      asset('/images/event-ease/11.png'),
      asset('/images/event-ease/12.png'),
      asset('/images/event-ease/13.png'),
      asset('/images/event-ease/14.png'),
      asset('/images/event-ease/15.png'),
      asset('/images/event-ease/16.png'),
      asset('/images/event-ease/17.png'),
    ],
  },

  {
    id: '02',
    name: 'Campus Vote',
    type: 'Verified student voting',
    categories: ['Mobile'],
    deviceType: 'mobile',
    description:
      'A location-aware Android voting experience with secure student-ID scanning, campus geofencing, and broadcast updates for trusted election management.',
    tags: ['Java', 'Firebase', 'ML Kit', 'Geofencing', 'Broadcast Receiver'],
    color: 'blue',
    mark: 'CV',
    metric: '100%',
    metricText: 'identity verification',
    screenshots: [
      asset('/images/campus-vote/13-login.jpg'),
      asset('/images/campus-vote/08-register.jpg'),
      asset('/images/campus-vote/16-scan-id.jpg'),
      asset('/images/campus-vote/01-profile.jpg'),
      asset('/images/campus-vote/07-dashboard.jpg'),
      asset('/images/campus-vote/12-live-dashboard.jpg'),
      asset('/images/campus-vote/02-candidates.jpg'),
      asset('/images/campus-vote/05-active-candidates.jpg'),
      asset('/images/campus-vote/17-vote.jpg'),
      asset('/images/campus-vote/14-geofence.jpg'),
      asset('/images/campus-vote/06-results.jpg'),
      asset('/images/campus-vote/03-documents.jpg'),
      asset('/images/campus-vote/11-broadcasts.jpg'),
      asset('/images/campus-vote/09-report.jpg'),
      asset('/images/campus-vote/10-feedback.jpg'),
      asset('/images/campus-vote/15-feedback-form.jpg'),
      asset('/images/campus-vote/04-clear-data.jpg'),
    ],
  },

  {
    id: '03',
    name: 'FinDesk',
    type: 'Finance administration',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A responsive administration workspace that makes university finance operations clear and accountable.',
    tags: ['PHP', 'MySQL', 'Responsive UI'],
    color: 'orange',
    mark: 'FD',
    metric: '3x',
    metricText: 'quicker reporting',
    screenshots: [
      asset('/images/findesk/07-dashboard.png'),
      asset('/images/findesk/03-create-goal.png'),
      asset('/images/findesk/04-allocate-budget.png'),
      asset('/images/findesk/05-view-budget-details.png'),
      asset('/images/findesk/01-expenditure-bill.png'),
      asset('/images/findesk/02-generated-bill.png'),
      asset('/images/findesk/06-excel-report.png'),
    ],
  },

  {
    id: '04',
    name: 'Smart Travel Mode',
    type: 'Android travel safety app',
    categories: ['Mobile'],
    deviceType: 'mobile',
    description:
      'An Android app that detects airplane mode changes and sends travel-status alerts with an optional location link to trusted family members.',
    tags: ['Java', 'XML', 'Broadcast Receiver'],
    color: 'blue',
    mark: 'ST',
    metric: 'Auto',
    metricText: 'travel status alerts',
    screenshots: [
      asset('/images/smart-travel/06-setup.jpg'),
      asset('/images/smart-travel/07-location-permission.jpg'),
      asset('/images/smart-travel/01-map.jpg'),
      asset('/images/smart-travel/02-boarding-notice.jpg'),
      asset('/images/smart-travel/10-landed-status.jpg'),
      asset('/images/smart-travel/05-landed-notice.jpg'),
      asset('/images/smart-travel/08-sms-sent.jpg'),
      asset('/images/smart-travel/03-email.jpg'),
      asset('/images/smart-travel/09-message-history.jpg'),
      asset('/images/smart-travel/04-settings.jpg'),
    ],
  },

  {
    id: '05',
    name: 'Research Paper Management',
    type: 'Research catalogue dashboard',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A full-stack research-paper management workspace where users can create, search, view, update, and delete paper records, with server-side pagination and PostgreSQL persistence.',
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'CRUD'],
    color: 'violet',
    mark: 'RP',
    metric: 'CRUD',
    metricText: 'full paper lifecycle',
    screenshots: [
      asset('/images/research-papers/05-list.jpg'),
      asset('/images/research-papers/07-pagination.jpg'),
      asset('/images/research-papers/03-create.jpg'),
      asset('/images/research-papers/02-details.jpg'),
      asset('/images/research-papers/01-edit.jpg'),
      asset('/images/research-papers/04-delete.jpg'),
      asset('/images/research-papers/06-postgresql.jpg'),
    ],
  },
];

export const skillGroups = [
  {
    label: 'Frontend',
    skills: ['React', 'JavaScript', 'HTML / CSS', 'Responsive UI'],
  },
  {
    label: 'Programming',
    skills: ['Java', 'JavaScript', 'XML', 'PHP'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express', 'REST APIs', 'Firebase'],
  },
  {
    label: 'Data',
    skills: ['MongoDB', 'MySQL', 'Firebase', 'PostgreSQL'],
  },
  {
    label: 'Tools',
    skills: ['Git', 'Figma', 'VS Code', 'Android Studio'],
  },
];

export const timeline = [
  {
    year: '2024 - 2026',
    title: 'MCA - Master of Computer Applications',
    place: 'Building deeper systems thinking through product-led engineering.',
    photos: [
      asset('/images/timeline/mca-semester-1.jpeg'),
      asset('/images/timeline/mca-semester-2.jpeg'),
      asset('/images/timeline/mca-semester-3.jpeg'),
    ],
  },
  {
    year: '2026 (Feb - June)',
    title: 'Programmer Trainee (E-Learning Associate)',
    place: 'Integra Software Services - 5 month professional experience.',
    photos: [asset('/images/timeline/integra-experience.jpeg')],
  },
  {
    year: '2025',
    title: 'Paper Presentation - JIGYASA 2025',
    place:
      'Student coordinator for the Tech Nova paper-presentation event at Puducherry Technological University.',
    photos: [asset('/images/timeline/ptu-paper-presentation.jpeg')],
  },
  {
    year: '2023',
    title: 'Software Development Training',
    place:
      'Askan Technologies - In-plant training in practical development.',
    photos: [asset('/images/timeline/askan-training.jpeg')],
  },
  {
    year: '2021 - 2024',
    title: 'BCA - Bachelor of Computer Applications',
    place:
      'A foundation in software development and computer science.',
    photos: [asset('/images/timeline/bca-certificate.jpeg')],
  },
];