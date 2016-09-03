//connection settings
var sqlConfig = {
  user: '****',
  password: '****',
  server: 'yoursqlserver.database.windows.net',
  database: 'BestGames',
  options: {
    //required for Azure db connections
    encrypt: true
  }
};

module.exports = sqlConfig;
