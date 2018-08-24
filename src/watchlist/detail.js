import db from './dynamodb';
import response from '../response';

/**
 * Get all watchlist items
 */
module.exports.handler = async ({ pathParameters = {}}, context, callback) => {
  const { item } = pathParameters;
  
  try {
    const result = await db.find(item);
    if (!result.Count) {
      callback(null, response.badRequest('item not found'));
      return;
    }
    callback(null, response.ok(result.Items[0] || {}));

  } catch (err) {
    console.error(err);
    callback(null, response.error());
  }
};
