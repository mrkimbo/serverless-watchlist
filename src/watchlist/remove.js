import db from './dynamodb';
import response from '../response';

/**
 * Remove an item from the watchlist
 */
module.exports.handler = async ({ pathParameters = {} }, context, callback) => {
  const { id } = pathParameters;
  
  try {
    await db.remove(id);
    callback(null, response.ok());
    
  } catch (err) {
    console.error(err.message);
    callback(null, response.error());
  }
};
