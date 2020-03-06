export function openInNewTab(url) {
  browser.tabs.create({ url });
}

export async function getCurrentTab() {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  return tabs[0] || {};
}

export async function getTab(tabId) {
  const tab = await browser.tabs.get(tabId);
  return tab || null;
}
