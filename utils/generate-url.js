module.exports = {
  thread: function generateThreadUrl(tid, pageNum = -1) {
    let url = `https://vozforums.com/showthread.php?t=${tid}`;
    if (pageNum !== -1) {
      url += `&page=${pageNum}`;
    }
    return url;
  },
  forum: function generateForumUrl(fid, {order = 'desc', pageNum = -1} = {}) {
    let url = `https://vozforums.com/forumdisplay.php?f=${fid}`;
    if (pageNum !== -1) {
      url += `&order=${order}&page=${pageNum}`;
    }
    return url;
  },
};
