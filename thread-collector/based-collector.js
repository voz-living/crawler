module.exports = class BasedCollector {
  constructor(option = {}) {
    this.option = option;
  }
  /**
   * return list of thread asyncronously
   */
  async getThreadList() {
    throw new Error('getThreadList must be implemented');
  }
};
