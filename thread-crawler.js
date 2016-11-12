const program = require('commander');
const cheerio = require('cheerio');

const request = require('./utils/request');
const generateUrl = require('./utils/generate-url');

program
  .version('1.0.0')
  .option('-t, --thread <n>', 'Thread Id', parseInt)
  .option('-p, --page <n>', 'Page number', parseInt)
  .option('-d, --dry-run', 'Dry run')
  .parse(process.argv);

const {thread: tid, page: pageNum, dryRun} = program;


async function threadCrawler(tid=null, pageNum = -1, dryRun=false) {
  if (tid === null) throw new Error('missing thread id');
  const html = await request(generateUrl.thread(tid, pageNum));
  console.log(html.length);
}

threadCrawler(tid, pageNum, dryRun);

