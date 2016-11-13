const BasedCollector = require('./basedd-collector');
const {
  THREAD_COLLECT_FIXED,
} = require('constants/types');
/**
 * Fixed Collector
 * @class FixedCollector
 * @extends {require('./basd-collector')}
 */
class FixedCollector extends BasedCollector {
  /**
   * return list of thread asyncronously
   * @return {Array} list of thread ids
   */
  async getThreadList() {
    return Promise.resolve([
      {id: 4270819, type: THREAD_COLLECT_FIXED},
      {id: 2065093, type: THREAD_COLLECT_FIXED},
      {id: 3334493, type: THREAD_COLLECT_FIXED},
      {id: 109799, type: THREAD_COLLECT_FIXED},
      {id: 158595, type: THREAD_COLLECT_FIXED},
      {id: 3339347, type: THREAD_COLLECT_FIXED},
      {id: 3009470, type: THREAD_COLLECT_FIXED},
    ]);
  }
}

module.exports = FixedCollector;
