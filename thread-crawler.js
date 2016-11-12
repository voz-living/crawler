const program = require('commander');
const cheerio = require('cheerio');

const request = require('utils/request');
const generateUrl = require('utils/generate-url');
const parseDateTime = require('utils/datetime').parse;

program
  .version('1.0.0')
  .option('-t, --thread <n>', 'Thread Id', parseInt)
  .option('-p, --page <n>', 'Page number', parseInt)
  .option('-d, --dry-run', 'Dry run')
  .parse(process.argv);

const {thread: tid, page: pageNum, dryRun} = program;


/**
 * threadCrawler
 * crawl thread
 * @param {any} [tid=null]
 * @param {any} [pageNum=-1]
 * @param {boolean} [dryRun=false]
 */
async function threadCrawler(tid=null, pageNum = -1, dryRun=false) {
  if (tid === null) throw new Error('missing thread id');
  const html = await request(generateUrl.thread(tid, pageNum));
  const $ = cheerio.load(html);
  const thread = parseThread($);
}

/**
 * @param {any} $
 */
function parseThread($) {
  // parse thread information
  const {pages} = parseThreadInformation($);
  const posts = [];
  // parse posts
  $('#posts > div').each(function(i, element) {
    const $this = $(this);
    parsePost($this);
  });
  return {};
}


/**
 * @param {any} $
 */
function parseThreadInformation($) {
  const $nav = $('.pagenav').eq(0).find('table .vbmenu_control').eq(0);
  let pages = 1;
  if($nav.length !== 0) {
    const text = $nav.text();
    const [, num] = text.match(/Page \d+ of (\d+)/);
    pages = num;
  }
  return {pages};
}

function parsePost($) {
  const $post = $.find('[id^="post"]');
  const [, postId] = $post.attr('id').match(/post(\d+)/);

  const $head = $post.find('td.thead')
  const postNum = parseInt($head.find('[id^="postcount"]').text());
  const datetimeStr = $head.find('> div').eq(1).text().trim();
  const datetime = parseDateTime(datetimeStr); 
  console.log(datetimeStr, datetime.toString());
}

threadCrawler(tid, pageNum, dryRun);

