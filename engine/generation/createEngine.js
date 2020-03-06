/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('isomorphic-fetch');
const pullAllWith = require('lodash/pullAllWith');
const { FiltersEngine, fetchLists, ENGINE_VERSION } = require('@cliqz/adblocker-webextension');
const path = require('path');
const { writeFile } = require('./utils');
const remoteLists = require('./lists/remote');
const { rules, whitelist } = require('./lists/custom');

const outputDir = path.resolve(__dirname, '../database');

const getAllrules = async () => {
  console.log('Fetch rules...');
  const { network, cosmetic } = rules;
  const customRules = Object.values(network).concat(cosmetic);
  const remoteRules = await Promise.all(
    Object.values(remoteLists).map(async (urls) => fetchLists(fetch, urls)),
  );
  const allRules = remoteRules.concat(customRules);
  const rulesAsText = allRules.join('\n');
  return pullAllWith(
    rulesAsText.split(/\n/g),
    whitelist,
    (ruleVal, whitelistVal) => ruleVal.trim() === whitelistVal.trim(),
  );
};

const createEngine = async () => {
  const allRules = await getAllrules();
  const rulesAsText = allRules.join('\n');
  const engine = FiltersEngine.parse(rulesAsText, { enableCompression: true });
  const serialized = engine.serialize();
  writeFile(`${outputDir}/engine_v${ENGINE_VERSION}.bytes`, serialized, (err) => {
    if (err) throw err;
    console.log(`Saved engine_v${ENGINE_VERSION}.bytes!`);
  });
};

createEngine().catch((error) => console.log('Fail to create engine.bytes', error));
