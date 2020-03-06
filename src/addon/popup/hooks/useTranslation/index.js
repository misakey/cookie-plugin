import { useCallback } from 'react';
import { getTranslation } from 'helpers/translations';

export default () => useCallback(
  (text, substitution, option) => getTranslation(text, substitution, option),
  [],
);
