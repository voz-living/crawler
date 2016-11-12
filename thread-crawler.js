const program = require('commander');
const cheerio = require('cheerio');
const _ = require('lodash');

const request = require('utils/request');
const generateUrl = require('utils/generate-url');
const parseDateTime = require('utils/datetime').parse;

const postModel = require('models/post');

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
function parseThread($, {skippedPageInfo=true} = {}) {
  // parse thread information
  let pages = null;
  if(!skippedPageInfo) pages = parseThreadInformation($);
  const posts = [];
  // parse posts
  $('#posts > div').each(function(i, element) {
    const $this = $(this);
    posts[i] = parsePost($this);
  });
  return {
    pages,
    posts,
  };
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


/**
 * parse post from cheerio object
 * @param {cheerio} cheerio document object
 * @return {Post} parsed Post
 */
function parsePost($) {
  const post = postModel.new();
  const $post = $.find('table[id^="post"]');
  const [, postId] = $post.attr('id').match(/post(\d+)/);
  post.id = postId;

  const $head = $post.find('td.thead');
  const $postCount = $head.find('[id^="postcount"]');
  post.url = $postCount.attr('href');
  post.num = parseInt($postCount.text());
  const datetimeStr = $head.find('> div').eq(1).text().trim();
  post.datetime = parseDateTime(datetimeStr);

  const $userNcontent = $post.find('> tr');
  // process user info
  const $user = $userNcontent.eq(1).find('table tr > td');
  post.user.img = $user.eq(0).find('a > img').attr('src');

  let _next = 1;
  if (_.isUndefined(post.user.img)) {
    post.user.img = null;
    _next = 0;
  }
  const $userInfo = $user.eq(_next).find(' > div');
  const $userName = $userInfo.eq(0).find('.bigusername');
  const [, userId] = $userName.attr('href').match(/u=(\d+)/);
  post.user.id = userId;
  post.user.name = $userName.text().trim();
  post.user.title = $userInfo.eq(1).text().trim();

  const $userMeta = $user.eq(_next + 2).find('> div > div');
  console.log($userMeta.text());
  const jd = $userMeta.eq(0).text().trim().split(':')[1].trim().split('-');
  post.user.joinDate = new Date(jd[1], jd[0], 1, 0, 0, 0);
  post.user.posts = parseInt($userMeta.eq(1).text().split(':')[1]
                                                .trim().replace(/,/g, ''));
  // end process user info

  const $content = $userNcontent.eq(2).find('div[id^="post_message"]');
  post.content.html = $content.html();
  post.content.text = $content.text().trim();

  return post;
}

threadCrawler(tid, pageNum, dryRun);

