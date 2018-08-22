import db from './dynamodb';
import response from '../response';

/**
 * Get all watchlist items
 */
module.exports.handler = async ({ queryStringParameters = {} }, context, callback) => {
  try {
    const result = await db.list();
    callback(null, response.ok(result.Items || []));

  } catch (err) {
    console.error(err);
    callback(null, response.error());
  }
};
