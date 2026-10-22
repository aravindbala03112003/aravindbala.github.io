/**
 * Accurate destination URLs and labels for projects in portfolio
 */

// Conceptual mapping matching Section 4
export const liveProjectLinks = {
  eventEase: {
    url: 'https://frontend-eta-rouge-22.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  campusVote: {
    url: 'https://github.com/aravindbala03112003/student-vote-app/releases/download/v1.0.0/CampusVote-v1.0.0.apk',
    type: 'apk',
    label: 'DOWNLOAD ANDROID APP ↓',
  },
  finDesk: {
    url: 'https://budget-management-system-tau.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  smartTravelMode: {
    url: 'https://github.com/aravindbala03112003/smart-travel-mode/releases/download/v1.0.0/app-release.apk',
    type: 'apk',
    label: 'DOWNLOAD ANDROID APP ↓',
  },
  researchPaperManagement: {
    url: 'https://crud-operations-bice-eight.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  foodRecommender: {
    url: 'https://personalized-food-recommender-muafuvcqrmz4j9x28dusft.streamlit.app/',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  eduHelp: {
    url: 'https://aravindbala03112003.github.io/eduhelp-student-support/',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  barberShop: {
    url: 'https://barber-shop-six-lyart.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  auraHeaven: {
    url: 'https://room-booking-system-psi.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
  onlineVehicleParkingSystem: {
    url: 'https://park-my-spot.vercel.app',
    type: 'web',
    label: 'OPEN LIVE PROJECT ↗',
  },
};

export const projectLinks = {
  '01': {
    id: '01',
    name: 'EventEase',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://frontend-eta-rouge-22.vercel.app',
    type: 'web',
    ariaLabel: 'Open live EventEase web application in a new browser tab',
  },
  '02': {
    id: '02',
    name: 'Campus Vote',
    label: 'DOWNLOAD ANDROID APP ↓',
    url: 'https://github.com/aravindbala03112003/student-vote-app/releases/download/v1.0.0/CampusVote-v1.0.0.apk',
    type: 'apk',
    ariaLabel: 'Download Campus Vote Android application APK',
  },
  '03': {
    id: '03',
    name: 'FinDesk',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://budget-management-system-tau.vercel.app',
    type: 'web',
    ariaLabel: 'Open live FinDesk web application in a new browser tab',
  },
  '04': {
    id: '04',
    name: 'Smart Travel Mode',
    label: 'DOWNLOAD ANDROID APP ↓',
    url: 'https://github.com/aravindbala03112003/smart-travel-mode/releases/download/v1.0.0/app-release.apk',
    type: 'apk',
    ariaLabel: 'Download Smart Travel Mode Android application APK',
  },
  '05': {
    id: '05',
    name: 'Research Paper Management',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://crud-operations-bice-eight.vercel.app',
    type: 'web',
    ariaLabel: 'Open live Research Paper Management web application in a new browser tab',
  },
  '06': {
    id: '06',
    name: 'Food Recommender',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://personalized-food-recommender-muafuvcqrmz4j9x28dusft.streamlit.app/',
    type: 'web',
    ariaLabel: 'Open live Food Recommender application in a new browser tab',
  },
  '07': {
    id: '07',
    name: 'Edu-Help',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://aravindbala03112003.github.io/eduhelp-student-support/',
    type: 'web',
    ariaLabel: 'Open live Edu-Help website in a new browser tab',
  },
  '08': {
    id: '08',
    name: 'BarberShop',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://barber-shop-six-lyart.vercel.app',
    type: 'web',
    ariaLabel: 'Open live BarberShop website in a new browser tab',
  },
  '09': {
    id: '09',
    name: 'Aura Heaven',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://room-booking-system-psi.vercel.app',
    type: 'web',
    ariaLabel: 'Open live Aura Heaven room booking application in a new browser tab',
  },
  '10': {
    id: '10',
    name: 'Online Vehicle Parking System',
    label: 'OPEN LIVE PROJECT ↗',
    url: 'https://park-my-spot.vercel.app',
    type: 'web',
    ariaLabel: 'Open live Online Vehicle Parking System in a new browser tab',
  },
  // Project 11 (Personal Portfolio) has its own button in the main navigation bar.
  // Explicitly null so no button is rendered in the project detail modal.
  '11': null,
};

/**
 * Robust helper to resolve live link config by project ID or normalized project name.
 * Returns null if no live link is configured (e.g. for Personal Portfolio).
 */
export function getProjectLiveConfig(project) {
  if (!project) return null;

  // Project 11: Personal Portfolio must NOT have an open live project button in the modal
  if (
    project.id === '11' ||
    (project.name && project.name.toLowerCase().includes('personal portfolio'))
  ) {
    return null;
  }

  // 1. Check if liveUrl is directly defined on project object
  if (project.liveUrl) {
    const isApk = project.liveType === 'apk';
    return {
      id: project.id,
      name: project.name,
      label: project.liveLabel || (isApk ? 'DOWNLOAD ANDROID APP ↓' : 'OPEN LIVE PROJECT ↗'),
      url: project.liveUrl,
      type: project.liveType || 'web',
      ariaLabel: isApk
        ? `Download ${project.name} Android application APK`
        : `Open live ${project.name} web application in a new browser tab`,
    };
  }

  // 2. Exact match by project.id
  if (project.id && projectLinks[project.id]) {
    return projectLinks[project.id];
  }

  // 3. Normalized name matching fallback
  const normalizedInput = (project.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!normalizedInput) return null;

  for (const key of Object.keys(projectLinks)) {
    const item = projectLinks[key];
    if (!item) continue;
    const normalizedItem = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (
      normalizedInput === normalizedItem ||
      normalizedInput.includes(normalizedItem) ||
      normalizedItem.includes(normalizedInput)
    ) {
      return item;
    }
  }

  return null;
}
