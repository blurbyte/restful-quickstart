var express = require('express');

//wrapper in case we want to inject custom parameters
var routes = function (sqlConfig) {

  var gameRouter = express.Router();
  var gameController = require('../controllers/gameController')(sqlConfig);

  //setting up main route
  gameRouter.route('/')
    //getting all records from db
    .get(gameController.get)
    //creating record in db
    .post(gameController.post);

  //setting up route with id parameter
  gameRouter.route('/:id')
    //getting single record from db specified by id
    .get(gameController.getById)
    //updating single record in db
    .put(gameController.put)
    //remove single record from db
    .delete(gameController.delete);

  return gameRouter;

};

module.exports = routes;
