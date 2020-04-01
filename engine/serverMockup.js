/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const path = require('path');
const { readFileSync } = require('fs');

const app = express();

const resourceDir = path.resolve(__dirname, './lists');

const analytics = readFileSync(`${resourceDir}/networkAnalytics.txt`, 'utf8');
const advertising = readFileSync(`${resourceDir}/networkAdvertising.txt`, 'utf8');
const cosmetic = readFileSync(`${resourceDir}/cosmetic.txt`, 'utf8');
const whitelist = readFileSync(`${resourceDir}/whitelist.txt`, 'utf8');

const PORT = 3005;

app.get('/networkAdvertising.txt', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(advertising);
});

app.get('/networkAnalytics.txt', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(analytics);
});

app.get('/cosmetic.txt', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(cosmetic);
});

app.get('/whitelist.txt', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(whitelist);
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});
