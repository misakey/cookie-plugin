/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('isomorphic-fetch');
const isEmpty = require('lodash/isEmpty');
const isNil = require('lodash/isNil');
const mergeWith = require('lodash/mergeWith');
const fromPairs = require('lodash/fromPairs');
const { NetworkFilter, detectFilterType, fetchLists, ENGINE_VERSION } = require('@cliqz/adblocker-webextension');
const path = require('path');
const { writeFile } = require('./utils');
const remoteLists = require('./lists/remote');
const { rules } = require('./lists/custom');

const outputDir = path.resolve(__dirname, '../database');

const FilterType = {
  NOT_SUPPORTED: 0,
  NETWORK: 1,
  COSMETIC: 2,
};

const customRules = rules.network;

const isComment = (line) => {
  // Ignore comments
  const firstCharCode = line.charCodeAt(0);
  const secondCharCode = line.charCodeAt(1);
  return (
    firstCharCode === 33
    || /* '!' */ (firstCharCode === 35 /* '#' */ && secondCharCode <= 32)
    || (firstCharCode === 91 /* '[' */ && line.startsWith('[Adblock'))
  );
};

const getPurpose = (pattern, networkFilter, comment) => {
  if (networkFilter.isException()) { return ''; }
  const { hostname } = networkFilter;

  if (['Taboola', 'Outbrain', 'Outbrain servers'].indexOf(comment) > -1) {
    return 'advertising';
  }

  if (comment.match(/Push Notifications/)
      || comment.match(/Newsletter/)
      || comment.match(/Scroll To Top Buttons/)
      || comment.match(/RSS Buttons/)
  ) { return 'social_interaction'; }

  if (pattern.match(/analytics/)) { return 'analytics'; }
  if (pattern.match(/googleadservices/) || pattern.match(/doubleclick/)) { return 'advertising'; }
  if (pattern.match(/facebook/)) { return 'social_interaction'; }

  if (hostname && (hostname.match(/taboola.com/) || hostname.match(/outbrain.com/))) { return 'advertising'; }

  return 'other';
};

const processLine = (line, mainPurpose, currentComment) => {
  const filterType = detectFilterType(line) || null;
  if (filterType === FilterType.NETWORK) {
    const networkFilter = NetworkFilter.parse(line.trim());
    if (isNil(networkFilter)) { return {}; }

    const purpose = mainPurpose !== 'other' ? mainPurpose : getPurpose(line, networkFilter, currentComment);
    const id = networkFilter.getId();
    return { id, purpose };
  }

  if (filterType === FilterType.NOT_SUPPORTED) {
    if (isComment(line)) {
      const comment = line.slice(1).trim();
      if (!isEmpty(comment)) { return { comment }; }
    }
  }

  return {};
};

const processFile = (mainPurpose, fileAsText) => {
  const lines = fileAsText.split(/\n/g);
  const result = lines.reduce(({ currentComment, rulesforFile }, line) => {
    const { id, purpose, comment } = processLine(line, mainPurpose, currentComment);

    if (!isNil(comment)) {
      return { currentComment: comment, rulesforFile };
    }

    if (!isNil(purpose) && !isNil(id)) {
      return {
        currentComment,
        rulesforFile: { ...rulesforFile, [id]: purpose },
      };
    }

    return { currentComment, rulesforFile };
  }, { currentComment: '', rulesforFile: {} });
  return result.rulesforFile;
};

const createJsonDB = async () => {
  const remoteRules = fromPairs(await Promise.all(
    Object.entries(remoteLists)
      .map(async ([purpose, urls]) => [purpose, await fetchLists(fetch, urls)]),
  ));
  const allRules = mergeWith(
    remoteRules,
    customRules,
    (objValue, srcValue) => objValue.concat(srcValue),
  );
  const rulesAsJson = Object.entries(allRules).reduce((total, [mainPurpose, filesAsText]) => {
    const purposeRules = filesAsText.reduce((totalPurpose, file) => {
      const fileRules = processFile(mainPurpose, file);
      console.log('1 File processed for:', mainPurpose);
      return { ...totalPurpose, ...fileRules };
    }, {});
    return { ...total, ...purposeRules };
  }, {});

  writeFile(`${outputDir}/rulesPurposes_v${ENGINE_VERSION}.json`, JSON.stringify({ rules: rulesAsJson }), (err) => {
    if (err) throw err;
    console.log(`Saved rules in rulesPurposes_v${ENGINE_VERSION}.json!`);
  });
};

createJsonDB().catch((error) => console.log(`Fail to create rulesPurposes_${ENGINE_VERSION}.json`, error));
