/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('isomorphic-fetch');
const path = require('path');
const { readFileSync } = require('fs');

const { fetchLists, fullLists } = require('@cliqz/adblocker-webextension');
// eslint-disable-next-line import/no-extraneous-dependencies
const prompt = require('prompt');

const listDir = path.resolve(__dirname, './lists');

const analytics = readFileSync(`${listDir}/networkAnalytics.txt`, 'utf8');
const advertising = readFileSync(`${listDir}/networkAdvertising.txt`, 'utf8');
const cosmetic = readFileSync(`${listDir}/cosmetic.txt`, 'utf8');
const whitelist = readFileSync(`${listDir}/whitelist.txt`, 'utf8');

function onErr(err) {
  console.log(err);
  return 1;
}

const customRules = [analytics, advertising, cosmetic];
const whitelistedRules = whitelist.split(/\n/g);

const getAllrules = async () => {
  const remoteRules = await fetchLists(fetch, fullLists);
  const allRules = remoteRules.concat(customRules);
  const rulesAsText = allRules.join('\n');
  return rulesAsText.split(/\n/g);
};

let allRules = [];

const findPattern = async (err, result) => {
  if (err) { return onErr(err); }
  if (result.pattern === 'stop') { return 1; }
  console.log('Command-line input received:');
  console.log(`Pattern: ${result.pattern}`);

  if (allRules.length === 0) {
    allRules = await getAllrules();
  }
  const found = allRules.filter((element) => element.match(new RegExp(`${result.pattern}`)));
  if (found.length > 0) {
    const whitelisted = whitelistedRules.filter((element) => element.match(new RegExp(`${result.pattern}`)));
    console.log(`Found rules: \n ${found.join('\n')}`);
    if (whitelisted.length > 0) {
      console.log(`Found in whitelist: \n${whitelisted.join('\n')}`);
    }
  } else {
    console.log(`No rules found for pattern: ${result.pattern}`);
  }
  return prompt.get(['pattern'], findPattern);
};

prompt.start();
console.log('Write `stop` to quit');
console.log('Write a regex to search a rules in our list of rules');
prompt.get(['pattern'], findPattern);
