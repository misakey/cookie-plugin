/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const path = require('path');

const app = express();
const { ENGINE_VERSION } = require('@cliqz/adblocker-webextension');

const databaseDir = path.resolve(__dirname, './database');

// eslint-disable-next-line import/no-dynamic-require
const rulesPurposes = require(`${databaseDir}/rulesPurposes_v${ENGINE_VERSION}.json`);
const fs = require('fs');

const PORT = 3005;

app.get(`/engine_v${ENGINE_VERSION}.bytes`, (req, res) => {
  // read file from file system
  fs.readFile(`${databaseDir}/engine_v${ENGINE_VERSION}.bytes`, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', 'application/octet-stream');
      res.end(data);
    }
  });
});

app.get(`/rulesPurposes_v${ENGINE_VERSION}.json`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rulesPurposes));
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});
