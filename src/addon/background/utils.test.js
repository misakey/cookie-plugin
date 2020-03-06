/* eslint-disable no-undef */
// @FIXME
import { filterAppsBy } from './utils';

test('test filterAppsBy ', () => {
  const apps = [
    {
      id: 'ib.adnxs.com',
      name: 'adnxs',
      mainDomain: 'ib.adnxs.com',
      mainPurpose: 'other',
    },
    {
      id: 'static.criteo.net',
      name: 'criteo',
      mainDomain: 'static.criteo.net',
      mainPurpose: 'advertising',
      additionalKey: 'test',
    },
    {
      id: 'bidder.criteo.net',
      name: 'criteo',
      mainDomain: 'bidder.criteo.net',
      mainPurpose: 'analytics',
    },
    {
      id: 'js-agent.newrelic.com',
      name: 'newrelic',
      mainDomain: 'js-agent.newrelic.com',
      mainPurpose: 'analytics',
    },
  ];


  expect(filterAppsBy(null, null, apps)).toEqual(apps);
  expect(filterAppsBy('cri', null, apps)).toEqual([
    {
      id: 'static.criteo.net',
      name: 'criteo',
      mainDomain: 'static.criteo.net',
      mainPurpose: 'advertising',
      additionalKey: 'test',
    },
    {
      id: 'bidder.criteo.net',
      name: 'criteo',
      mainDomain: 'bidder.criteo.net',
      mainPurpose: 'analytics',
    },
  ]);

  expect(filterAppsBy('cri', 'analytics', apps)).toEqual([
    {
      id: 'bidder.criteo.net',
      name: 'criteo',
      mainDomain: 'bidder.criteo.net',
      mainPurpose: 'analytics',
    },
  ]);
});
