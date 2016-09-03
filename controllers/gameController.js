var sql = require('mssql');

//Revealing Module Pattern, with custom parameter injection (in this case sqlConfig)
var gameController = function(sqlConfig) {

  var get = function (req, res) {
    //creating new connection for each queue
    var connection = new sql.Connection(sqlConfig);
    connection.connect()
      .then(function () {
        //new SQL request for opened connection
        var request = new sql.Request(connection);
        //if you need data from a few tables at once you want to use
        //request.multiple = true;
        //and after that just
        //request.query('select * from game; select * from genre');

        request.query('select * from game;')
          .then(function (recordset) {
            //HATEOAS implementation - self-documenting API
            //in each request there is set of hyperlinks you can use to navigate api

            //recordset is just simple json object
            //appending hyperlink to each record
            var returnGames = recordset.map(function (element) {
              return Object.assign(element, { links: { self: 'http://' + req.headers.host + '/api/games/' + element.id } });
            });
            //sendig final json response
            res.json(returnGames);
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  };

  var post = function (req, res) {
    var connection = new sql.Connection(sqlConfig);
    connection.connect()
      .then(function () {
        //creating MS SQL prepared statement (aka parameterized query)
        //for all database create/update operations it is safer and more efficient to use prepared statement rather than regular query
        var ps = new sql.PreparedStatement(connection);
        //list of supported datatypes https://github.com/patriksimek/node-mssql#data-types
        ps.input('title', sql.NVarChar(500));
        ps.input('rating', sql.TinyInt);
        ps.input('genre', sql.NVarChar(100));
        ps.input('descr', sql.NVarChar(sql.MAX));

        //game schema definition
        //values got extracted from body of request by body parser middleware
        var game = {
          title: req.body.title,
          rating: req.body.rating,
          genre: req.body.genre,
          descr: req.body.descr
        };

        //prepared statement definition
        ps.prepare('insert into game(title, rating, genre, descr) values (@title, @rating, @genre, @descr);')
          .then(function () {
            //execute prepared statement
            ps.execute(game)
              .then(function () {
                //return status 'created' and passed data
                //it is not required to send result, just be consistent across whole API
                res.status(201).json(game);
              })
              .catch(function (err) {
                res.status(400).send(err);
              });
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  };

  var getById = function (req, res) {
    var connection = new sql.Connection(sqlConfig);
    connection.connect()
      .then(function () {
        var ps = new sql.PreparedStatement(connection);
        ps.input('id', sql.Int);

        ps.prepare('select * from game where id = @id;')
          .then(function () {
            ps.execute({ id: req.params.id })
              .then(function (recordset) {
                if (recordset.length === 0) {
                  //could as well place redirect to whole list of customers
                  //returns 'not found' status
                  res.sendStatus(404);
                }
                else {
                  //Possible HATEOAS hyperlinks, helping to navigate around API
                  //even if it is only 1 element SQL passes back array
                  res.json(recordset[0]);
                }
              })
              .catch(function (err) {
                res.status(400).send(err);
              });
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  };

  var put = function (req, res) {
    var connection = new sql.Connection(sqlConfig);
    connection.connect()
      .then(function () {
        var ps = new sql.PreparedStatement(connection);
        ps.input('id', sql.Int);
        ps.input('title', sql.NVarChar(500));
        ps.input('rating', sql.TinyInt);
        ps.input('genre', sql.NVarChar(100));
        ps.input('descr', sql.NVarChar(sql.MAX));

        //customer schema definition
        var game = {
          title: req.body.title,
          rating: req.body.rating,
          genre: req.body.genre,
          descr: req.body.descr
        };

        ps.prepare('update game set title = @title, rating = @rating, genre = @genre, descr = @descr where id = @id;')
          .then(function () {
            ps.execute(Object.assign(game, { id: req.params.id }))
              .then(function () {
                //checking if any records got changed aka proper id got passed
                if (ps.lastRequest.rowsAffected === 0) {
                  res.sendStatus(404);
                }
                else {
                  //return passed data
                  res.json(game);
                }
              })
              .catch(function (err) {
                res.status(400).send(err);
              });
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  };

  var deleteItem = function (req, res) {
    var connection = new sql.Connection(sqlConfig);
    connection.connect()
      .then(function () {
        var ps = new sql.PreparedStatement(connection);
        ps.input('id', sql.Int);

        ps.prepare('delete from game where id = @id;')
          .then(function () {
            ps.execute({ id: req.params.id })
              .then(function () {
                if (ps.lastRequest.rowsAffected === 0) {
                  res.sendStatus(404);
                }
                else {
                  //server successfully processed the request
                  res.sendStatus(204);
                }
              })
              .catch(function (err) {
                res.status(400).send(err);
              });
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  };

  //only these functions will be exposed
  return {
    post: post,
    get: get,
    getById: getById,
    put: put,
    delete: deleteItem
  };

};

module.exports = gameController;
