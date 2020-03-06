const fs = require('fs');

const manifestTpl = require('./template.json');

const targetBrowser = process.env.TARGET_BROWSER || 'firefox';
// build for browser target
const targetManifest = (manifestTpl[`${targetBrowser}_specific`])
  ? { ...manifestTpl.common, ...manifestTpl[`${targetBrowser}_specific`] }
  : { ...manifestTpl.common };

const newManifestString = JSON.stringify(targetManifest);

fs.writeFile('./public/manifest.json', newManifestString, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`manifest.json created for ${targetBrowser}!`);
});
