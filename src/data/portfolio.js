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

  {
    id: '06',
    name: 'Food Recommender',
    type: 'Food recommendation system',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'Personalized food discovery through an intelligent recommendation system, presented in a clean and accessible interface.',
    modalDescription:
      'An intelligent food recommendation platform engineered to deliver personalized dietary guidance. Combines collaborative filtering (KNN & SVD), content-based NLP (TF-IDF & BERT), and health-aware ML models with SHAP explainability across 120,000 real nutrition and review records.',
    challenge:
      'Personalizing food choices across complex health conditions, dietary restrictions, and caloric goals while avoiding cold-start limitations.',
    approach:
      'Engineered a multi-algorithm pipeline combining KNN collaborative filtering, SVD matrix factorization, and GNNs with SHAP explainability analysis.',
    tags: ['Python', 'HTML', 'CSS', 'KNN', 'SVD', 'BERT', 'CNN', 'GNN'],
    color: 'emerald',
    mark: 'FR',
    metric: '120K',
    metricText: 'nutrition & review records',
    screenshots: [
      asset('/images/food-recommender/User dashboard.png'),
      asset('/images/food-recommender/User dashboard inputs.png'),
      asset('/images/food-recommender/Goal recommender.png'),
      asset('/images/food-recommender/KNN+SVD.png'),
      asset('/images/food-recommender/Existing Recommendation Final.png'),
      asset('/images/food-recommender/Comparison graph.png'),
      asset('/images/food-recommender/Daily Nutrition.png'),
      asset('/images/food-recommender/Budget graph.png'),
      asset('/images/food-recommender/Dataset.png'),
      asset('/images/food-recommender/Performance Matrics2.png'),
      asset('/images/food-recommender/Admin Dashboard.png'),
      asset('/images/food-recommender/Admin Dashboard Model.png'),
      asset('/images/food-recommender/User Login1.png'),
    ],
  },

  {
    id: '07',
    name: 'EDU-HELP',
    type: 'Student support system',
    category: 'Student Support and Administrative Ticket Management System',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A student support platform for raising, tracking, and resolving administrative requests through a structured ticket management workflow.',
    modalDescription:
      'EDU-HELP is a student support and administrative ticket management application that helps users raise requests for issues such as ID cards, hall tickets, fee receipts, and other administrative concerns. Administrators can review requests, manage tickets, and update their status to help students track progress toward resolution.',
    challenge:
      'Eliminating institutional bottlenecks, delayed student inquiries, and untracked administrative resolutions across fragmented campus offices.',
    approach:
      'Engineered an SLA-governed ticket lifecycle platform with deterministic turnaround countdowns, role-based isolation (Student, Staff, Manager), real-time audit threads, and executive capacity analytics.',
    tags: ['React', 'Node.js', 'Express.js', 'PostgreSQL'],
    color: 'cyan',
    mark: 'EH',
    metric: '100%',
    metricText: 'SLA ticket tracking',
    screenshots: [
      asset('/images/edu-help/Screenshot 2026-10-21 162605.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162616.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162632.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162642.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162654.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162707.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162714.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162800.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162807.png'),
      asset('/images/edu-help/Screenshot 2026-10-21 162827.png'),
    ],
  },

  {
    id: '08',
    name: 'Barber Shop',
    type: 'Barber shop booking system',
    category: 'BARBER SHOP BOOKING SYSTEM',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'An online appointment booking system that helps customers explore barber services and schedule appointments through a streamlined interface.',
    modalDescription:
      'An online barber shop booking application designed to simplify appointment scheduling and provide a convenient way for customers to explore barber services, pricing tiers, and manage their appointments with ease.',
    challenge:
      'Replacing manual phone-based appointments and disjointed salon scheduling with an intuitive, automated booking flow that prevents double-booking.',
    approach:
      'Designed a high-conversion booking interface in Figma and implemented it with PHP, MySQL, and vanilla JavaScript, featuring dynamic service selection, real-time time-slot allocation, and appointment management.',
    tags: ['Figma (UI/UX)', 'HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    color: 'orange',
    mark: 'BS',
    metric: '100%',
    metricText: 'online scheduling',
    screenshots: [
      asset('/images/barber-shop/Screenshot 2026-10-21 171910.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 171929.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 171935.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 171942.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 171951.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 171958.png'),
      asset('/images/barber-shop/Screenshot 2026-10-21 172003.png'),
    ],
  },

  {
    id: '09',
    name: 'Aura Heaven',
    type: 'Hotel room booking system',
    category: 'HOTEL ROOM BOOKING SYSTEM',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A modern hotel room booking application designed to simplify room discovery and reservation management through an elegant user experience.',
    modalDescription:
      'Aura Heaven is a hotel room booking application designed to provide a convenient way to explore accommodation options, review room details, and manage room reservations through a streamlined digital experience.',
    challenge:
      'Streamlining multi-tier hotel room reservations, dynamic date-based price calculations, and real-time inventory tracking into a friction-free booking journey for guests and hoteliers.',
    approach:
      'Engineered a full-stack booking system with React, Node.js, Express, and MongoDB, featuring search-and-filter discovery, room amenity breakdowns, guest authentication, and an administrative control suite for inventory and revenue analytics.',
    tags: ['Figma (UI/UX)', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    color: 'gold',
    mark: 'AH',
    metric: '100%',
    metricText: 'instant booking',
    screenshots: [
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174341.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174355.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174510.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174426.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174407.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174533.png'),
      asset('/images/hotel-room-booking/Screenshot 2026-10-21 174541.png'),
    ],
  },

  {
    id: '10',
    name: 'Online Vehicle Parking System',
    type: 'Online vehicle parking management system',
    category: 'ONLINE VEHICLE PARKING MANAGEMENT SYSTEM',
    categories: ['Web', 'Systems'],
    deviceType: 'web',
    description:
      'A streamlined parking management application for exploring available slots, making reservations, and managing parking details.',
    modalDescription:
      'An online vehicle parking management application designed to simplify parking-slot selection and reservation management through a clear, user-friendly interface.',
    challenge:
      'Eliminating parking congestion, manual entry logs, and bay allocation confusion with an intuitive digital reservation system and real-time bay occupancy visualizer.',
    approach:
      'Developed a responsive web interface using HTML, CSS, JavaScript, and MySQL, featuring interactive slot diagrams, lane-based bay selection, automated duration billing ($5/hr), and ticket verification.',
    tags: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    color: 'orange',
    mark: 'VP',
    metric: '56 Bays',
    metricText: 'live slot tracking',
    screenshots: [
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181402.png'),
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181430.png'),
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181440.png'),
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181500.png'),
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181447.png'),
      asset('/images/vehicle-parking/Screenshot 2026-10-21 181409.png'),
    ],
  },

  {
    id: '11',
    name: 'Personal Portfolio',
    type: 'Personal portfolio mobile application',
    category: 'PERSONAL PORTFOLIO MOBILE APPLICATION',
    categories: ['Mobile'],
    deviceType: 'mobile',
    description:
      'A responsive personal portfolio mobile application built with Flutter to deliver immersive project exploration, interactive 3D widgets, and streamlined contact.',
    modalDescription:
      'PERSONAL PORTFOLIO is a modern cross-platform mobile application engineered in Flutter, translating the desktop portfolio experience into a native mobile journey with smooth animations, interactive telemetry counters, and responsive case-study navigation.',
    challenge:
      'Translating a rich multi-layered desktop web experience with 3D depth, video loops, and dynamic layouts into a fluid, battery-efficient, 60fps native Flutter mobile experience.',
    approach:
      'Engineered using Flutter and Dart with clean component architecture, adaptive layouts for various phone aspect ratios, interactive self-intro video presentation, and custom tactile touch interactions.',
    tags: ['Flutter'],
    color: 'cyan',
    mark: 'PP',
    metric: '60 FPS',
    metricText: 'native Flutter UI',
    screenshots: [
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.54 PM (1).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.54 PM (2).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.54 PM.jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.53 PM (2).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.51 PM (2).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.53 PM (1).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.53 PM.jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.52 PM (1).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.52 PM.jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.52 PM (3).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.52 PM (2).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.51 PM (1).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.51 PM.jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.50 PM (2).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.50 PM.jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.50 PM (1).jpeg'),
      asset('/photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.49 PM.jpeg'),
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