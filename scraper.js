'use strict';

const request = require('request-promise');
const { formatResponse } = require('./util');

const USER = 'ur28880908';
const getWatchListURL = (user) => `https://www.imdb.com/user/${user}/watchlist`;

module.exports.scrape = async ({ queryStringParameters }, context, callback) => {
  const { user = USER } = queryStringParameters || {};
  console.log(`Fetching watchlist for user ${user}`);
  
  try {
    // load and parse watchlist html
    const options = {
      uri: getWatchListURL(user),
      transform: (body) => {
        const pattern = /IMDbReactInitialState\.push\(([^<]+)/i;
        const json = (pattern.exec(body) || [])[1] || '';
        
        return JSON.parse(json.trim().slice(0, -2));
      }
    };
    
    const page = await request(options);
    const entries = Object.values(page.titles).map((item) => ({
      title: item.primary.title,
      url: item.primary.href,
      genre: item.metadata.genres.join(','),
    }));
    
    // lambda response format
    callback(null, formatResponse(200, { entries }));
    
  } catch (err) {
    console.log(err.message);
    callback(null, formatResponse(500, { message: 'The operation failed' }));
  }
};
