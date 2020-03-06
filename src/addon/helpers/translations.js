import head from 'lodash/head';
import isArray from 'lodash/isArray';

export function getTranslation(key, substitution, options = { plural: false }) {
  const substitutions = isArray(substitution) ? substitution : [substitution];
  const textKey = (options.plural && head(substitutions) > 1) ? `${key}_plural` : key;
  return browser.i18n.getMessage(textKey, substitutions) || textKey;
}
