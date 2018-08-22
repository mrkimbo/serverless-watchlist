'use strict';

const { response, watchlist } = require('./util');

/**
 * Add a new item to the watchlist
 */
module.exports.handler = async ({ queryStringParameters }, context, callback) => {
  const { id, title, genre, year } = queryStringParameters;
  
  // check for duplicates
  if (await watchlist.contains(id)) {
    callback(null, response.custom(400, { message: "Item exists" }));
    return;
  }
  
  const item = { id, title, genre, year };
  try {
    await watchlist.add(item);
    callback(null, response.ok());
    
  } catch (err) {
    callback(err, response.error());
  }
};
