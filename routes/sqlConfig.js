//connection settings
var sqlConfig = {
  user: 'amaneris',
  password: 'Pimp767Peon',
  server: 'blurbytesql.database.windows.net',
  database: 'BestGames',
  options: {
    //required for Azure db connections
    encrypt: true
  }
};

module.exports = sqlConfig;
