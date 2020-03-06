import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

export function capitalize(name) {
  if (!isString(name) || isEmpty(name)) { return ''; }
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
