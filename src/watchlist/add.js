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
  if (await db.contains(item.id)) {
    callback(null, response.badRequest('Item exists'));
    return;
  }
  
  console.log('adding item:', item);
  
  try {
    await db.add(item);
    callback(null, response.ok({ message: 'Item added' }));
  } catch (err) {
    console.error(err.message);
    callback(null, response.error());
  }
};
