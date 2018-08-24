import db from './dynamodb';
import response from '../response';

/**
 * Remove an item from the watchlist
 */
module.exports.handler = async ({ pathParameters = {} }, context, callback) => {
  const { item } = pathParameters;
  
  const result = await db.find(item);
  if (!result.Count) {
    callback(null, response.badRequest('Item does not exist'));
    return;
  }
  
  console.log('Removing item', item);
  
  try {
    await db.remove(item);
    callback(null, response.ok({ message: 'Item removed' }));
    
  } catch (err) {
    console.error(err.message);
    callback(null, response.error());
  }
};
