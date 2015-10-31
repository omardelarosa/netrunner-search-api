var request = require('request');
var conf        = require('../config');
var _           = require('lodash');
var elasticSearch = require('elasticsearch');
var esConfig      = conf.esConfig;
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

var getCards = function () {
  return new Promise(function(resolve, reject) {
    return request(
      'http://netrunnerdb.com/api/cards/', 
      function(err, res, body) {
        if (err) { return reject(err); }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
  });
};

var createCardPromise = function (card, client) {
  return new Promise(function(resolve, reject) {
    client.create({
      index: 'netrunner',
      type: 'card',
      body: card
    }, function (err, res) {
      if (err) { return reject(err); }
      resolve(res);
    });
  });
};

function Importer () {
  var cards = [];
  var cardCreatePromises = [];

  return new Promise(function(resolve, reject){
      getCards().then(function(cardData) {
        cards = cardData;
        console.log("Cards", cards.length);
        connectToES().then(function(client){
          cardCreatePromises = cards.map(function(c){
            return createCardPromise(c, client);
          });
          Promise.all(cardCreatePromises).then(function(res) {
            console.log('Imported all cards', res.length);
            disconnectFromES().then(resolve);
          }, function (err) {
            console.log('error importing, will reject', err);
            disconnectFromES().then(reject.bind(this, err));
          });
        });
    });
  });
}

module.exports = Importer;
