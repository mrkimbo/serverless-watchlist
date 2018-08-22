'use strict';

const { response, OMDB } = require('./util');

/**
 * Search for movies
 * Expects request in format: /search/{query}/{page}
 */
module.exports.handler = async ({ pathParameters}) => {
  const { query, page = 1 } = pathParameters || {};
  if (!query) {
    const error = new Error('Missing query parameter');
    callback(error, response.custom(400, { message: error.message }));
    return;
  }
  
  try {
    const items = await OMDB.search(query, page);
    callback(null, response.ok(items));
  } catch(err) {
    callback(err, response.ok([]));
  }
};
