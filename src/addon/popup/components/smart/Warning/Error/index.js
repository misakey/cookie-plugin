import React, { useCallback } from 'react';
import WarningDrawer from 'popup/components/smart/Warning';

// COMPONENTS
const WarningErrorDrawer = () => {
  const refreshExtension = useCallback(() => browser.runtime.reload(), []);
  return (
    <WarningDrawer type="error" action={refreshExtension} />
  );
};

export default WarningErrorDrawer;
