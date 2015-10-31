
var Config = {
  
  esConfig: {
    host: process.env.ES_URI
  },

  es: {
    type: 'review',
    indexName: 'netrunner'
  },

  mongo: {
    uri: process.env.MONGO_URI,
    collectionName: 'cards'
  }

};


module.exports = Config;
