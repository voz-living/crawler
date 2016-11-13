module.exports = {
  'new': function newThread() {
    return {
      _fresh: true,
      _updatedDate: new Date(),

      url: '',
      id: -1,
      createdDate: null,
      updatedDate: null,
      title: '',
      posts: [],
      pages: 1,
      rating: null,
      isPinned: false,
      viewCount: null,
      postCount: null,
      progress: {
        page: 0,
        post: 10,
      },
    };
  },
};
