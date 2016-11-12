const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const threadModel = require('models/thread');

const config = require('../config.json');

const DOCUMENT_REPO_PATH = path.join(__dirname, '../', config.DOCUMENTS_REPO_PATH);
const THREADS_PATH = path.join(DOCUMENT_REPO_PATH, 'threads');

async function loadThreadDocument(tid) {
  const threadPath = path.join(THREADS_PATH, tid + '');
  const indexPath = path.join(threadPath, 'index.yml');
  return new Promise((resolve, reject) => {
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) resolve(threadModel.new());
      else {
        const doc = yaml.safeLoad(data.toString());
        resolve(doc);
      }
    });
  });
}

async function updateThreadDocument(threadDoc, {
  posts,
}) {
  return new Promise((resolve, reject) => {
    const threadPath = path.join(THREADS_PATH, threadDoc.id + '');
    const indexPath = path.join(threadPath, 'index.yml');
    const postsPath = path.join(threadPath, 'posts');
    // console.log(threadPath, postsPath);
    updateThreadDocumentPrepare(threadPath, postsPath).then(() => {
      Promise.all([
        updateThreadDocumentIndex(threadDoc, indexPath),
        updateThreadDocumentPosts(posts, postsPath),
      ])
      .then(() => {
        resolve();
      })
      .catch(reject);
    });
  });
}

function updateThreadDocumentPrepare(threadPath, postsPath) {
  return new Promise((resolve, reject) => {
    fs.access(threadPath, fs.constants.F_OK, (error) => {
      if (error) {
        try {
          fs.mkdirSync(threadPath);
          fs.mkdirSync(postsPath);
          resolve(true);
        } catch (e) {
          reject({
            error: e,
          });
        }
      } else {
        resolve(true);
      }
    });
  });
}

function updateThreadDocumentIndex(threadDoc, indexPath) {
  const serializedDoc = yaml.dump(threadDoc);
  return new Promise((resolve, reject) => {
    fs.writeFile(indexPath, serializedDoc, 'utf8', (error) => {
      if (error) reject({
        error,
      });
      resolve(true);
    });
  });
}

function updateThreadDocumentPosts(posts, postsPath) {
  return new Promise((resolve, reject) => {
    Promise.all(posts.map((post) => new Promise((resolve2, reject2) => {
        const postPath = path.join(postsPath, post.id + '.yml');
        const serializedPost = yaml.dump(post);
        fs.writeFile(postPath, serializedPost, 'utf8', (error) => {
          if (error) reject2({
            error,
          });
          resolve2(true);
        });
      })))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  loadThreadDocument,
  updateThreadDocument,
};