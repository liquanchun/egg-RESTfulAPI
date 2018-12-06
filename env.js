module.exports = {
  server: {
    port: 3300,
    wsport: 3001,
    url: 'http://localhost:3300',
  },
  jwt: {
    secret: '`yGE[RniLYCX6rCni>DKG_(3#si&zvA$WPmgrb2P',
    expiresIn: 36000,
  },
  knex: {
    client: 'mysql',
    connection: {
      host: '11111111',
      port: 3306,
      user: 'root',
      password: '********',
      database: 'car_app',
    },
    pool: { min: 0, max: 7 },
    debug: true,
    asyncStackTraces: true,
    fetchAsString: ['date', 'datetime'],
  },
};
