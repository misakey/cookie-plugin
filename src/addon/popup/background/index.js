
const NAME = 'popup';
let port = null;

function connectToBackground() {
  port = browser.runtime.connect({ name: NAME });
}

export function listenForBackground(cb) {
  if (!port) {
    connectToBackground();
  }
  port.onMessage.addListener(cb);
}

export function stopListenerForBackground(cb) {
  port.onMessage.removeListener(cb);
}
