export const REFRESH_WARNING_SHOW = Symbol('REFRESH_WARNING_SHOW');
export const REFRESH_WARNING_HIDE = Symbol('REFRESH_WARNING_HIDE');

export const refreshWarningShow = () => ({
  type: REFRESH_WARNING_SHOW,
});
export const refreshWarningHide = () => ({
  type: REFRESH_WARNING_HIDE,
});
