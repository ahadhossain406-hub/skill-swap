// Frontend-er mock data-r moto data, kintu ekhon MySQL-e jabe.
// id gulo fixed rakha hoyeche, jate "kon user", "kon skill" thik thake.
const d = (iso) => new Date(iso);

export const categories = [
  'Design',
  'Programming',
  'Languages',
  'Music',
  'Business',
  'Academics',
  'Lifestyle',
];

// [name, category]. id = list-e position (1 theke shuru).
export const skills = [
  ['Photoshop', 'Design'],
  ['Illustrator', 'Design'],
  ['UI/UX Design', 'Design'],
  ['Video Editing', 'Design'],
  ['Web Development', 'Programming'],
  ['Python', 'Programming'],
  ['Java', 'Programming'],
  ['Data Analysis', 'Programming'],
  ['English Speaking', 'Languages'],
  ['IELTS Preparation', 'Languages'],
  ['Arabic', 'Languages'],
  ['Guitar', 'Music'],
  ['Singing', 'Music'],
  ['Digital Marketing', 'Business'],
  ['Public Speaking', 'Business'],
  ['Excel', 'Business'],
  ['Calculus', 'Academics'],
  ['Physics', 'Academics'],
  ['Statistics', 'Academics'],
  ['Cooking', 'Lifestyle'],
  ['Photography', 'Lifestyle'],
  ['Fitness Training', 'Lifestyle'],
  ['Content Writing', 'Business'],
];

// teaches = [skillId, level], learns = [skillId]
export const users = [
  {
    id: 1, name: 'Ayesha Rahman', email: 'ayesha@skillswap.com', password: 'password123', role: 'user',
    bio: 'Graphic design student who loves branding. Want to build my own portfolio website.',
    location: 'Dhaka', color: '#6366f1', joinedAt: d('2026-09-01T10:00:00Z'),
    teaches: [[1, 'Advanced'], [2, 'Intermediate']], learns: [5, 6],
  },
  {
    id: 2, name: 'Tanvir Hasan', email: 'tanvir@skillswap.com', password: 'password123', role: 'user',
    bio: 'Full-stack developer. I like teaching by building small projects.',
    location: 'Savar', color: '#0ea5e9', joinedAt: d('2026-09-03T10:00:00Z'),
    teaches: [[5, 'Advanced'], [6, 'Intermediate']], learns: [1, 9],
  },
  {
    id: 3, name: 'Nusrat Jahan', email: 'nusrat@skillswap.com', password: 'password123', role: 'user',
    bio: 'IELTS 8.0 scorer. Happy to help with speaking and writing.',
    location: 'Chattogram', color: '#10b981', joinedAt: d('2026-09-05T10:00:00Z'),
    teaches: [[9, 'Advanced'], [10, 'Advanced']], learns: [3, 12],
  },
  {
    id: 4, name: 'Rafiq Ahmed', email: 'rafiq@skillswap.com', password: 'password123', role: 'user',
    bio: 'Band member and guitar teacher on weekends.',
    location: 'Sylhet', color: '#f59e0b', joinedAt: d('2026-09-08T10:00:00Z'),
    teaches: [[12, 'Advanced'], [13, 'Intermediate']], learns: [5, 15],
  },
  {
    id: 5, name: 'Sadia Islam', email: 'sadia@skillswap.com', password: 'password123', role: 'user',
    bio: 'UI/UX designer interning at a startup.',
    location: 'Dhaka', color: '#ec4899', joinedAt: d('2026-09-10T10:00:00Z'),
    teaches: [[3, 'Advanced'], [4, 'Intermediate']], learns: [6, 14],
  },
  {
    id: 6, name: 'Imran Hossain', email: 'imran@skillswap.com', password: 'password123', role: 'user',
    bio: 'Marketing graduate. Excel and campaign strategy are my thing.',
    location: 'Rajshahi', color: '#8b5cf6', joinedAt: d('2026-09-12T10:00:00Z'),
    teaches: [[14, 'Advanced'], [16, 'Advanced']], learns: [1, 8],
  },
  {
    id: 7, name: 'Farhana Akter', email: 'farhana@skillswap.com', password: 'password123', role: 'user',
    bio: 'Math tutor. I make calculus feel easy.',
    location: 'Dhaka', color: '#14b8a6', joinedAt: d('2026-09-15T10:00:00Z'),
    teaches: [[17, 'Advanced'], [19, 'Advanced'], [18, 'Intermediate']], learns: [9, 20],
  },
  {
    id: 8, name: 'Mehedi Hasan', email: 'mehedi@skillswap.com', password: 'password123', role: 'user',
    bio: 'Data science enthusiast. Python is my favorite language.',
    location: 'Savar', color: '#ef4444', joinedAt: d('2026-09-18T10:00:00Z'),
    teaches: [[6, 'Advanced'], [8, 'Advanced']], learns: [2, 15],
  },
  {
    id: 9, name: 'Admin', email: 'admin@skillswap.com', password: 'admin123', role: 'admin',
    bio: 'Platform administrator.',
    location: 'Dhaka', color: '#0f172a', joinedAt: d('2026-08-01T10:00:00Z'),
    teaches: [], learns: [],
  },
];

// [id, from_user_id, to_user_id, offered_skill_id, requested_skill_id, message, status, created_at, responded_at]
export const requests = [
  [1, 2, 1, 5, 1, 'Hi Ayesha! I can teach you web development basics in exchange for Photoshop lessons. Would you like to swap?', 'pending', d('2026-11-18T09:30:00Z'), null],
  [2, 8, 1, 6, 2, 'I can help you start with Python. I would love to learn Illustrator from you.', 'accepted', d('2026-11-15T14:00:00Z'), d('2026-11-16T08:15:00Z')],
  [3, 1, 6, 1, 16, 'Hello Imran, I can teach Photoshop and would love to learn Excel from you.', 'pending', d('2026-11-19T11:00:00Z'), null],
  [4, 1, 4, 2, 12, '', 'declined', d('2026-11-12T16:45:00Z'), d('2026-11-13T10:00:00Z')],
  [5, 3, 2, 9, 5, 'Hi Tanvir! I can help with your English speaking if you teach me web development.', 'accepted', d('2026-10-10T09:00:00Z'), d('2026-10-11T09:00:00Z')],
  [6, 7, 2, 17, 6, 'Happy to teach calculus in return for Python lessons.', 'accepted', d('2026-10-15T09:00:00Z'), d('2026-10-16T09:00:00Z')],
  [7, 1, 8, 1, 6, 'Photoshop for Python? Let us swap!', 'accepted', d('2026-10-20T09:00:00Z'), d('2026-10-21T09:00:00Z')],
];

// [id, request_id, teacher_id, learner_id, skill_id, session_date, session_time, duration_mins, mode, location, notes, status, created_at, completed_at]
export const sessions = [
  [1, 2, 8, 1, 6, '2026-11-25', '18:00:00', 60, 'online', '', 'Python basics: variables, loops and functions.', 'scheduled', d('2026-11-16T09:00:00Z'), null],
  [2, 2, 1, 8, 2, '2026-11-28', '11:00:00', 90, 'in-person', 'University Library, Savar', 'Bring your laptop with Illustrator installed.', 'scheduled', d('2026-11-16T09:10:00Z'), null],
  [3, 2, 1, 8, 2, '2026-11-17', '16:00:00', 60, 'online', '', 'Intro to Illustrator tools.', 'completed', d('2026-11-15T15:00:00Z'), d('2026-11-17T17:05:00Z')],
  [4, 2, 8, 1, 6, '2026-11-19', '15:00:00', 60, 'online', '', '', 'cancelled', d('2026-11-15T15:30:00Z'), null],
  [5, 5, 2, 3, 5, '2026-10-20', '16:00:00', 60, 'online', '', 'Intro to HTML and CSS.', 'completed', d('2026-10-15T09:00:00Z'), d('2026-10-20T17:00:00Z')],
  [6, 6, 2, 7, 6, '2026-10-28', '17:00:00', 60, 'online', '', 'Python functions and loops.', 'completed', d('2026-10-22T09:00:00Z'), d('2026-10-28T18:05:00Z')],
  [7, 7, 8, 1, 6, '2026-10-30', '15:00:00', 60, 'online', '', 'Python for beginners.', 'completed', d('2026-10-24T09:00:00Z'), d('2026-10-30T16:00:00Z')],
];

// [id, session_id, reviewer_id, reviewee_id, skill_id, rating, comment, created_at]
export const reviews = [
  [1, 3, 8, 1, 2, 5, 'Ayesha explained the Illustrator tools very clearly. I learned a lot in one hour!', d('2026-11-17T18:00:00Z')],
  [2, 5, 3, 2, 5, 5, 'Tanvir is patient and builds real examples while teaching. Highly recommended.', d('2026-10-20T18:00:00Z')],
  [3, 6, 7, 2, 6, 4, 'Good session. A few more practice problems would have been nice.', d('2026-10-28T19:00:00Z')],
  [4, 7, 1, 8, 6, 5, 'Mehedi made Python feel easy. Great teacher!', d('2026-10-30T17:00:00Z')],
];

// [id, user_id, message, link, is_read, created_at]
export const notifications = [
  [1, 1, 'Welcome to SkillSwap! Add your skills to start finding matches.', '/profile', true, d('2026-09-01T10:00:00Z')],
  [2, 1, 'Tanvir Hasan sent you a swap request.', '/requests', false, d('2026-11-18T09:30:00Z')],
  [3, 1, 'Mehedi Hasan scheduled a session with you.', '/sessions', false, d('2026-11-16T09:00:00Z')],
  [4, 1, 'Mehedi Hasan rated your session 5 stars.', '/profile', false, d('2026-11-17T18:00:00Z')],
  [5, 8, 'Ayesha Rahman accepted your swap request.', '/requests', true, d('2026-11-16T08:15:00Z')],
];

// [id, owner_id, title, description, github_url, demo_url, created_at]
export const projects = [
  [1, 1, 'Portfolio Website Redesign', 'A personal portfolio website for a graphic designer. Ayesha creates the branding and visuals while Tanvir turns the designs into a fast React website.', 'https://github.com', '', d('2026-11-10T10:00:00Z')],
  [2, 8, 'Student Marks Analyzer', 'A Python tool that reads exam marks from a spreadsheet and shows averages, top performers and grade charts for a class.', '', '', d('2026-11-08T09:00:00Z')],
  [3, 4, 'Campus Band Promo Video', 'A short promo video for our campus band. We are recording the music live and editing it into a 1 minute teaser for social media.', '', '', d('2026-11-05T17:00:00Z')],
];

// [project_id, skill_id]
export const projectSkills = [[1, 1], [1, 5], [1, 3], [2, 6], [2, 8], [3, 12], [3, 13], [3, 4]];

// [project_id, user_id, role]
export const projectMembers = [
  [1, 1, 'Designer'],
  [1, 2, 'Developer'],
  [2, 8, 'Lead developer'],
  [2, 5, 'UI designer'],
  [3, 4, 'Musician'],
];

// [project_id, user_id]
export const projectLikes = [[1, 2], [1, 3], [1, 8], [2, 1]];

// [project_id, user_id, text, created_at]
export const projectComments = [
  [1, 3, 'Love the colour palette! Cannot wait to see it live.', d('2026-11-12T09:20:00Z')],
  [1, 8, 'Great idea. A designer and a developer is the perfect team.', d('2026-11-13T14:05:00Z')],
];

// [project_id, user_id, description, hours, created_at]
export const contributions = [
  [1, 1, 'Created logo and colour palette', 4, d('2026-11-11T08:00:00Z')],
  [1, 2, 'Set up React project and navbar', 3, d('2026-11-12T10:30:00Z')],
  [1, 1, 'Designed homepage mockups', 5, d('2026-11-14T16:00:00Z')],
  [1, 2, 'Built the homepage layout', 6, d('2026-11-16T12:15:00Z')],
  [2, 8, 'Wrote the data loading and cleaning code', 7, d('2026-11-09T11:00:00Z')],
  [2, 5, 'Designed the report layout', 2.5, d('2026-11-15T15:30:00Z')],
  [3, 4, 'Recorded the guitar track', 3, d('2026-11-06T18:00:00Z')],
];