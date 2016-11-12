module.exports = {
  thread: function generateThreadUrl(tid, pageNum = -1) {
    let url = `https://vozforums.com/showthread.php?t=${tid}`;
    if (pageNum !== -1) {
      url += `&page=${pageNum}`;
    }
    return url;
  },
};
