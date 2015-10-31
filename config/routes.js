var controllers = require('../app/controllers');

module.exports = function (app) {
  
  app.get('/search/:query', controllers.Search.byQueryString);

};
