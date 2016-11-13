const BasedCollector = require('./based-collector');
const generateUrl = require('utils/generate-url');
const request = require('utils/request');
const parseForum = require('parsers/forum');
const {
  THREAD_COLLECT_RECENT,
} = require('constants/types');
/**
 * Fixed Collector
 * @class FixedCollector
 * @extends {require('./basd-collector')}
 */
class MostRecentCollector extends BasedCollector {
  /**
   * return list of thread asyncronously
   * @return {Array} list of thread ids
   */
  async getThreadList() {
    const {
      fid = 17
    } = this.option;
    const html = await request(generateUrl.forum(fid));
    const tids = parseForum(html).map((t) => Object.assign({}, t, {
      type: THREAD_COLLECT_RECENT,
    }));
    return tids;
  }
}

if (require.main === module) {
  const program = require('commander');
  program
    .version('1.0.0')
    .option('-f, --forum <n>', 'Forum Id', parseInt)
    .parse(process.argv);

  const {
    forum = 17,
  } = program;
  const collector = new MostRecentCollector({
    fid: forum,
  });
  collector.getThreadList().then((tids) => console.log(tids));
} else {
  module.exports = MostRecentCollector;
}
