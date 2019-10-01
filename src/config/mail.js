export default {
  host: 'smtp.mailtrap.io',
  port: 1025,
  rateLimit: 1,
  secure: false,
  auth: {
    user: 'fed7286117dafd',
    pass: 'e095b17d7bbac5',
  },
  pool: true,
  rateLimit: true,
  maxConnections: 1,
  maxMessages: 3,
  default: {
    from: 'Equipe MeetApp <noreply@meetapp.com>',
  },
};
