// likes = je user-ra like koreche (user id-r list)
// members = { userId, role }
// contributions = kaj-er log. hours = koto ghonta kaj korechhe.
export const mockProjects = [
  {
    id: 1,
    ownerId: 1,
    title: 'Portfolio Website Redesign',
    description:
      'A personal portfolio website for a graphic designer. Ayesha creates the branding and visuals while Tanvir turns the designs into a fast React website.',
    skillIds: [1, 5, 3],
    githubUrl: 'https://github.com',
    demoUrl: '',
    createdAt: '2026-11-10T10:00:00.000Z',
    likes: [2, 3, 8],
    comments: [
      {
        id: 101,
        userId: 3,
        text: 'Love the colour palette! Cannot wait to see it live.',
        createdAt: '2026-11-12T09:20:00.000Z',
      },
      {
        id: 102,
        userId: 8,
        text: 'Great idea. A designer and a developer is the perfect team.',
        createdAt: '2026-11-13T14:05:00.000Z',
      },
    ],
    members: [
      { userId: 1, role: 'Designer' },
      { userId: 2, role: 'Developer' },
    ],
    contributions: [
      { id: 1001, userId: 1, description: 'Created logo and colour palette', hours: 4, createdAt: '2026-11-11T08:00:00.000Z' },
      { id: 1002, userId: 2, description: 'Set up React project and navbar', hours: 3, createdAt: '2026-11-12T10:30:00.000Z' },
      { id: 1003, userId: 1, description: 'Designed homepage mockups', hours: 5, createdAt: '2026-11-14T16:00:00.000Z' },
      { id: 1004, userId: 2, description: 'Built the homepage layout', hours: 6, createdAt: '2026-11-16T12:15:00.000Z' },
    ],
  },
  {
    id: 2,
    ownerId: 8,
    title: 'Student Marks Analyzer',
    description:
      'A Python tool that reads exam marks from a spreadsheet and shows averages, top performers and grade charts for a class.',
    skillIds: [6, 8],
    githubUrl: '',
    demoUrl: '',
    createdAt: '2026-11-08T09:00:00.000Z',
    likes: [1],
    comments: [],
    members: [
      { userId: 8, role: 'Lead developer' },
      { userId: 5, role: 'UI designer' },
    ],
    contributions: [
      { id: 2001, userId: 8, description: 'Wrote the data loading and cleaning code', hours: 7, createdAt: '2026-11-09T11:00:00.000Z' },
      { id: 2002, userId: 5, description: 'Designed the report layout', hours: 2.5, createdAt: '2026-11-15T15:30:00.000Z' },
    ],
  },
  {
    id: 3,
    ownerId: 4,
    title: 'Campus Band Promo Video',
    description:
      'A short promo video for our campus band. We are recording the music live and editing it into a 1 minute teaser for social media.',
    skillIds: [12, 13, 4],
    githubUrl: '',
    demoUrl: '',
    createdAt: '2026-11-05T17:00:00.000Z',
    likes: [],
    comments: [],
    members: [{ userId: 4, role: 'Musician' }],
    contributions: [
      { id: 3001, userId: 4, description: 'Recorded the guitar track', hours: 3, createdAt: '2026-11-06T18:00:00.000Z' },
    ],
  },
];