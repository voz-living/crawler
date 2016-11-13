const cheerio = require('cheerio');
module.exports = function parseForumPage(html) {
  const $ = cheerio.load(html);
  const $trs = $('tbody#threadbits_forum_33 > tr > td[id^="td_threadtitle_"]');
  const tids = [];
  $trs.each(function(i, e){
    const [, id] = e.attribs.id.match(/td_threadtitle_(\d+)/);
    tids.push({id: parseInt(id)});
  });
  return tids;
};
