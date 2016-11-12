module.exports = {
  'new': function newPost() {
    return {
      url: '',
      id: -1,
      tid: -1,
      num: -1,
      datetime: null,
      user: {
        img: null,
        name: '',
        title: '',
        joinDate: null,
        posts: null,
      },
      title: '',
      content: {
        html: '',
        text: '',
      },
    };
  },
};
