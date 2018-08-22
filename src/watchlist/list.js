'use strict';

const { response, watchlist } = require('./util');

/**
 * Get all watchlist items
 */
module.exports.handler = async ({ queryStringParameters }, context, callback) => {
  try {
    const result = await watchlist.list();
    callback(null, response.ok(result.Items || []));

  } catch (err) {
    callback(err, response.error());
  }
};
