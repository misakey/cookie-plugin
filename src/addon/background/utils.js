import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import common from '@misakey/ui/colors/common';

export function log(element) {
  // eslint-disable-next-line no-console
  console.log(element);
}

export function setBadgeBackgroundColor(color) {
  try {
    browser.browserAction.setBadgeBackgroundColor({ color });
  } catch (error) {
    log('Operation not supported by device');
  }
}

export function setBadgeTextColor(color) {
  try {
    browser.browserAction.setBadgeTextColor({ color });
  } catch (error) {
    log('Operation not supported by device');
  }
}

export function setBadgeText(text) {
  try {
    browser.browserAction.setBadgeText({ text });
  } catch (error) {
    log('Operation not supported by device');
  }
}

export function setIcon(path) {
  try {
    browser.browserAction.setIcon({ path });
  } catch (error) {
    log('Operation not supported by device');
  }
}

export function toggleBadgeAndIconOnPaused(paused = false) {
  const color = paused ? common.primary : common.misakey;
  const path = paused ? 'ico/icon-32x32-grey.png' : 'ico/icon-32x32.png';

  setBadgeBackgroundColor(color);
  setIcon(path);
}

export function filterAppsBy(search, mainPurpose, apps) {
  let filteredApps = [...apps];
  if (isString(search) && !isEmpty(search)) {
    filteredApps = filteredApps
      .filter((app) => (app.mainDomain.toLowerCase().includes(search.toLowerCase())));
  }

  if (mainPurpose) {
    filteredApps = filteredApps.filter((app) => (app.mainPurpose === mainPurpose));
  }

  return filteredApps;
}
