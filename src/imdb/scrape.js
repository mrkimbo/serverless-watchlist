'use strict';

const request = require('request-promise');
const { response } = require('./util');

const USER = 'ur28880908';
const getWatchListURL = (user) => `https://www.imdb.com/user/${user}/watchlist`;

module.exports.handler = async ({ queryStringParameters }, context, callback) => {
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
    callback(null, response.ok(entries));
    
  } catch (err) {
    callback(err, response.error());
  }
};
