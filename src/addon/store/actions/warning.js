export const SHOW_WARNING = 'SHOW_WARNING';
export const HIDE_WARNING = 'HIDE_WARNING';

export const showWarning = (warningType) => ({
  type: SHOW_WARNING,
  warningType,
});
export const hideWarning = (warningType) => ({
  type: HIDE_WARNING,
  warningType,
});
