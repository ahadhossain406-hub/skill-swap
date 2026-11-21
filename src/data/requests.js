// Mock request. status: pending, accepted, declined, cancelled
// offeredSkillId   = je skill sender (fromUser) shekhabe
// requestedSkillId = je skill sender shikhte chay (receiver shekhabe)
export const mockRequests = [
  {
    id: 1,
    fromUserId: 2,
    toUserId: 1,
    offeredSkillId: 5,
    requestedSkillId: 1,
    message:
      'Hi Ayesha! I can teach you web development basics in exchange for Photoshop lessons. Would you like to swap?',
    status: 'pending',
    createdAt: '2026-11-18T09:30:00.000Z',
    respondedAt: null,
  },
  {
    id: 2,
    fromUserId: 8,
    toUserId: 1,
    offeredSkillId: 6,
    requestedSkillId: 2,
    message: 'I can help you start with Python. I would love to learn Illustrator from you.',
    status: 'accepted',
    createdAt: '2026-11-15T14:00:00.000Z',
    respondedAt: '2026-11-16T08:15:00.000Z',
  },
  {
    id: 3,
    fromUserId: 1,
    toUserId: 6,
    offeredSkillId: 1,
    requestedSkillId: 16,
    message: 'Hello Imran, I can teach Photoshop and would love to learn Excel from you.',
    status: 'pending',
    createdAt: '2026-11-19T11:00:00.000Z',
    respondedAt: null,
  },
  {
    id: 4,
    fromUserId: 1,
    toUserId: 4,
    offeredSkillId: 2,
    requestedSkillId: 12,
    message: '',
    status: 'declined',
    createdAt: '2026-11-12T16:45:00.000Z',
    respondedAt: '2026-11-13T10:00:00.000Z',
  },
];