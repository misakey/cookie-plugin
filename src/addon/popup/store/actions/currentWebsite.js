export const SET_CURRENT_WEBSITE = Symbol('SET_CURRENT_WEBSITE');

export function setCurrentWebsite(currentWebsite) {
  return {
    type: SET_CURRENT_WEBSITE,
    currentWebsite,
  };
}
