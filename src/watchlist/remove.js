'use strict';

const { response, watchlist } = require('./util');

/**
 * Remove an item from the watchlist
 */
module.exports.handler = async ({ queryStringParameters }, context, callback) => {
  const { id } = queryStringParameters;
  
  try {
    await watchlist.remove(id);
    callback(null, response.ok());
    
  } catch (err) {
    callback(err, response.error());
  }
};
