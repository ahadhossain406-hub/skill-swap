// userId = je user-ke notification dekhabe. read = pora hoyeche kina.
export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    message: 'Welcome to SkillSwap! Add your skills to start finding matches.',
    link: '/profile',
    read: true,
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 2,
    userId: 1,
    message: 'Tanvir Hasan sent you a swap request.',
    link: '/requests',
    read: false,
    createdAt: '2026-11-18T09:30:00.000Z',
  },
  {
    id: 3,
    userId: 1,
    message: 'Mehedi Hasan scheduled a session with you.',
    link: '/sessions',
    read: false,
    createdAt: '2026-11-16T09:00:00.000Z',
  },
  {
    id: 4,
    userId: 1,
    message: 'Mehedi Hasan rated your session 5 stars.',
    link: '/profile',
    read: false,
    createdAt: '2026-11-17T18:00:00.000Z',
  },
  {
    id: 5,
    userId: 8,
    message: 'Ayesha Rahman accepted your swap request.',
    link: '/requests',
    read: true,
    createdAt: '2026-11-16T08:15:00.000Z',
  },
];