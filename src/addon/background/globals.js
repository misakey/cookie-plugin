import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import parser from 'ua-parser-js';
import { parse } from 'tldts';
import { getCurrentTab } from 'helpers/tabs';
import { setItem, getItem } from 'background/storage';
import { toggleBadgeAndIconOnPaused, filterAppsBy, setBadgeText } from 'background/utils';

// HELPERS
const DEFAULT_PURPOSE = 'other';

/**
 * Structure which holds parameters to be used throughout the code, a.k.a. global values.
 * Most of them (but not all) are const.
 */
class Globals {
  constructor() {
    this.BROWSER_INFOS = {};
    this.rules = {};

    this.tabsInfos = new Map();
    this.tabsInitiator = new Map();
    this.counter = new Map();

    this.pausedTime = null;

    this.popupOpened = null;
    this.getWhitelist();
    this.getPaused();
    this.getBrowserInfo();
  }

  isBlockingActive() {
    return this.pausedBlocking === false;
  }

  async getWhitelist() {
    const { whitelist } = await getItem('whitelist');
    this.whitelist = whitelist || { apps: [], appsFormated: [] };
  }

  async getPaused() {
    const { pausedBlocking } = await getItem('pausedBlocking');
    this.pausedBlocking = !isNil(pausedBlocking) ? pausedBlocking : false;
  }

  async getBrowserInfo() {
    const ua = parser(navigator.userAgent);
    const name = ua.browser.name.toLowerCase();
    const version = parseInt(ua.browser.version.toString(), 10); // convert to string for Chrome
    this.BROWSER_INFOS = {
      name,
      version,
    };
  }

  getRuleIdByFilter(filter) {
    const result = Object.values(this.rules).findIndex((rule) => rule.pattern === filter);
    return result !== -1 ? Object.keys(this.rules)[result] : null;
  }

  initTabInfos(tabId) {
    this.tabsInfos.set(tabId, []);
    this.counter.delete(tabId);
  }

  getTabInfos(tabId) {
    if (!tabId) { return []; }
    if (!this.tabsInfos.has(tabId)) {
      this.initTabInfos(tabId);
    }
    return this.tabsInfos.get(tabId);
  }

  removeTabsInfos(tabId) {
    this.counter.delete(tabId);
    this.tabsInfos.delete(tabId);
    this.tabsInitiator.delete(tabId);
  }

  /* Helper function used to both reset, increment and show the current value of
  * the blocked requests counter for a given tabId.
  */
  updateActiveTrackerCounter(tabId, { reset = false, incr = false } = {}) {
    if (tabId === -1) { return; }

    const newValue = (reset === true ? 0 : this.counter.get(tabId) || 0) + (incr === true ? 1 : 0);
    this.counter.set(tabId, newValue);

    getCurrentTab().then(({ id }) => {
      if (tabId === id && this.isBlockingActive()) {
        setBadgeText(`${this.counter.get(tabId) || 0}`);
      }
    });
  }

  /* Helper function used to set in tabInfos the different request detected and if it
  * has been blocked or not according to whitelist or paused state.
  * It also retrieved the known app and purpose associated to the rule that has blocked the request
  */
  updateBlockingInfos({ tabId, url }, mainPurpose, blocked = false) {
    const { hostname, domainWithoutSuffix } = parse(url);

    const newTabInfos = [...this.getTabInfos(tabId)];
    const app = {
      mainDomain: hostname,
      mainPurpose,
      blocked,
      name: domainWithoutSuffix,
      id: hostname,
    };

    const alreadyDetected = newTabInfos.find((a) => a.mainDomain === hostname);

    // Group scripts detected by mainDomain
    if (!isEmpty(alreadyDetected)) {
      // If the previous script detected has no known category but this one have one
      // we replace the category associated to the tracker
      if (mainPurpose !== DEFAULT_PURPOSE && alreadyDetected.mainPurpose === DEFAULT_PURPOSE) {
        alreadyDetected.mainPurpose = mainPurpose;
        alreadyDetected.blocked = alreadyDetected.blocked || blocked;
        this.tabsInfos.set(tabId, newTabInfos);
        return;
      }
      // The detected script doesn't bring any new information about the app
      if (mainPurpose === DEFAULT_PURPOSE || mainPurpose === alreadyDetected.mainPurpose) {
        return;
      }
    }

    newTabInfos.push(app);
    this.tabsInfos.set(tabId, newTabInfos);
    this.updateActiveTrackerCounter(tabId, { incr: blocked });
  }

  getTabInfosForPopup(tabId) {
    return Object.entries(groupBy(this.getTabInfos(tabId), 'mainPurpose'))
      .map(([mainPurpose, apps]) => ({
        name: mainPurpose,
        apps,
      }));
  }

  async convertDetectedTrackersToApps() {
    return getCurrentTab().then(({ id }) => this.getTabInfos(id));
  }

  async getThirdPartyApps(search, mainPurpose) {
    const apps = await (this.convertDetectedTrackersToApps());
    return filterAppsBy(search, mainPurpose, apps);
  }

  /**
   * Helper function used to pause the blocker
   * it can take a time argument (optional) in milliseconds
   */
  async onPauseBlocker(time) {
    this.pausedBlocking = !this.pausedBlocking;

    if (time) {
      this.pausedBlocking = true;
      this.pausedTime = time;
      // handle clearing of a previous timeout to reset a new timeout and avoid collision
      if (!isNil(this.pausedTimeout)) { clearTimeout(this.pausedTimeout); }

      const globals = this;

      this.pausedTimeout = setTimeout(() => {
        globals.pausedBlocking = false;
        globals.pausedTime = null;
        toggleBadgeAndIconOnPaused(this.pausedBlocking);
        setItem('pausedBlocking', globals.pausedBlocking);
      }, time - Date.now());
    } else if (this.pausedTime && !this.pausedBlocking) {
      this.pausedTime = null;
    }
    toggleBadgeAndIconOnPaused(this.pausedBlocking);
    setItem('pausedBlocking', this.pausedBlocking);
    return { paused: this.pausedBlocking, pausedTime: this.pausedTime };
  }

  updateWhitelist(whitelist) {
    this.whitelist = whitelist;
    return setItem('whitelist', this.whitelist);
  }

  isRequestWhitelisted(targetDomain) {
    const globalWhitelist = this.whitelist.apps || [];
    return globalWhitelist.includes(targetDomain);
  }
}

// return the class as a singleton
export default new Globals();
