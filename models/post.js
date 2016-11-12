module.exports = {
  'new': function newPost() {
    return {
      url: String,
      id: Number,
      threadId: Number,
      num: Number,
      datetime: Date,
      user: {
        img: String,
        name: String,
        title: String,
        joinDate: Date,
        posts: Number,
      },
      content: {
        html: String,
        text: String,
      },
    };
  },
};
