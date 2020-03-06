
import parser from 'ua-parser-js';


export function getBrowserInfo() {
  const ua = parser(navigator.userAgent);
  const name = ua.browser.name.toLowerCase();
  const version = parseInt(ua.browser.version.toString(), 10); // convert to string for Chrome
  return {
    name,
    version,
  };
}

export function isDesktopDevice() {
  const ua = parser(navigator.userAgent);
  return !(ua.device.model || '').includes(['mobile', 'tablet']);
}
