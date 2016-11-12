const request = require('request');

module.exports = async function _request(url) {
  console.log(`Request: ${url}`);
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if ( !error && response.statusCode === 200 ) {
        resolve(html);
      } else {
        reject({error, response});
      }
    });
  });
};
