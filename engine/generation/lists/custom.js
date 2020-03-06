
const { readFileSync } = require('fs');
const path = require('path');

const resourcePath = path.resolve(__dirname, '../resources');

const getCustomList = () => {
  const analytics = readFileSync(`${resourcePath}/networkAnalytics.txt`, 'utf8');
  const advertising = readFileSync(`${resourcePath}/networkAdvertising.txt`, 'utf8');
  const cosmetic = readFileSync(`${resourcePath}/banners.txt`, 'utf8');
  return {
    network: {
      analytics,
      advertising,
    },
    cosmetic,
  };
};

const getWhitelist = () => readFileSync(`${resourcePath}/whitelist.txt`, 'utf8');

module.exports.rules = getCustomList();
module.exports.whitelist = getWhitelist();
