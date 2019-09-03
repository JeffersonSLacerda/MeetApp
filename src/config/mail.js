export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  rateLimit: 1,
  secure: false,
  auth: {
    user: 'fed7286117dafd',
    pass: 'e095b17d7bbac5',
  },
  pool: true,
  rateLimit: true,
  maxConnections: 1,
  maxMessages: 1,
  default: {
    from: 'Equipe MeetApp <noreply@meetapp.com>',
  },
};
