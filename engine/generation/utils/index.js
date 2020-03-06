const fs = require('fs');
const { dirname } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const mkdirp = require('mkdirp');

const writeFile = (path, contents, cb) => {
  mkdirp(dirname(path), (err) => {
    if (err) return cb(err);
    return fs.writeFile(path, contents, cb);
  });
};

module.exports.writeFile = writeFile;
