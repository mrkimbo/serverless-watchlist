import db from './dynamodb';
import response from '../response';

/**
 * Add a new item to the watchlist
 */
module.exports.handler = async ({ body }, context, callback) => {
  let item;
  
  try {
    const { id, title, genre, year } = JSON.parse(body);
    item = { id, title, genre, year };
  } catch (err) {
    console.error(err.message);
    callback(null, response.badRequest('Missing or malformed POST body'));
    return;
  }

// check for duplicates
  const result = await db.find(item.id);
  if (result.Count) {
    callback(null, response.badRequest('Item already exists'));
    return;
  }
  
  console.log('Adding item:', item);
  
  try {
    await db.add(item);
    callback(null, response.ok({ message: 'Item was added' }));
  } catch (err) {
    console.error(err.message);
    callback(null, response.error());
  }
};
