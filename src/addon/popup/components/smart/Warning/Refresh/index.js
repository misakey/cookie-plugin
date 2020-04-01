import React, { useCallback } from 'react';

import WarningDrawer from 'popup/components/smart/Warning';

// COMPONENTS
const WarningRefreshDrawer = () => {
  const refreshTab = useCallback(() => browser.tabs.reload({ bypassCache: true }), []);
  return <WarningDrawer type="refresh" action={refreshTab} />;
};
export default WarningRefreshDrawer;
