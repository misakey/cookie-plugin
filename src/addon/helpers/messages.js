export const GET_BLOCKER_STATE = 'getBlockerState';

export async function sendMessage(action, params) {
  return browser.runtime.sendMessage({ action, ...params });
}
