var elasticSearch = require('elasticsearch');
var conf          = require('../../config');
var esConfig      = conf.esConfig;
var _             = require('lodash');
var client;

if (typeof Promise === 'undefined') { Promise = require('q').Promise; }

var connectToES = function(){
  return new Promise(function(resolve, reject) {
    try {
      client = new elasticSearch.Client(_.clone(esConfig));
      resolve(client);
    } catch (e) {
      reject(e);
    }
  });
};

var disconnectFromES = function () {
  return new Promise(function(resolve, reject) {
    if (client && client.close) {
      resolve(client.close());
    } else {
      reject(new Error('Invalid client'));
    }
  });
};

var formatResults = function (results) {
  if (results.hits && results._shards.total > 0) {
    return _.map(
      _.filter(results.hits.hits, function (h) {
        return h._score >= 1.0;
      }), function (h) {
        return h._source;
      });
  } else {
    return [];
  }
};

module.exports = {
  byQueryString: function (req, res, next) {
    if (!req.params || !req.params.query) {
      res.send(400);
    }
    var q = req.params.query;
    connectToES().then(function(client){
      client.search({
        index: 'netrunner',
        q: q
      }).then(function(esResponse) {
        disconnectFromES().then(function(){
          res.send(formatResults(esResponse)); 
        });
      }, function (err) {
        console.log('Error:');
        console.log(err.message);
        console.log(err.stack);
        res.send(500);
      });
    }, function (err) {
      console.log('Error:', err.message);
      console.log(err.stack);
      res.send(500);
    });
  }
};
