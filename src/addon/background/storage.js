import { log } from 'background/utils';

export async function setItem(key, value) {
  try {
    await browser.storage.sync.set({ [key]: value });
    return true;
  } catch (error) {
    log(`Fail to set storage value: ${error}`);
    return false;
  }
}

export async function getItem(key) {
  return browser.storage.sync.get(key);
}
