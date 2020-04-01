### Rules generation

`cliqz/adblocker` uses adblock rules format [Adblock Filter cheatsheet](https://adblockplus.org/filter-cheatsheet).

To generate its blocking engine, the plugin uses the method `fromLists` of [@cliqz/adblocker](https://www.npmjs.com/package/@cliqz/adblocker) library with
* `fullList` (adblocking, tracking and cookie banners removing) from `@cliqz/adblocker` based on the list of rules below: 
   - [easylist](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/easylist/easylist.txt)
   - [easylistgermany](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/easylist/easylistgermany.txt)
   - [peter-lowe/serverlist](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/peter-lowe/serverlist.txt)
   - [ublock-origin/annoyances](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/annoyances.txt)
   - [ublock-origin/badware](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/badware.txt)
   - [ublock-origin](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/filters.txt)
   - [ublock-origin/resource-abuse](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/resource-abuse.txt)
   - [ublock-origin/unbreak](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/unbreak.txt)
   - [easyprivacy](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/easylist/easyprivacy.txt)
   - [ublock-origin/privacy](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/ublock-origin/privacy.txt)
   - [easylist-cookie](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/easylist/easylist-cookie.txt)
   - [fanboy/annoyance](https://raw.githubusercontent.com/cliqz-oss/adblocker/master/packages/adblocker/assets/fanboy/annoyance.txt)

* Rules collected by Misakey
  - `./engine/lists/cosmetic.txt` 
  - `./engine/lists/networkAdvertising.txt` 
  - `./engine/lists/networkAnalytics.txt` 

### Add a blocking rule
* format the rule according to [Adblock Filter cheatsheet](https://adblockplus.org/filter-cheatsheet) (Adblock Plus specific pseudo-selectors not supported)
* Add it to the file `engine/lists/cosmetic.txt` for cosmetic rules and to `engine/lists/network*.txt` for networkRules
* Test it in the plugin with the server mockup and your browser (See root `README.md > Addon > Test new rules` and `Tests on browser` section
)

### Remove a blocking rule
* Add the rule to the file `engine/list/whitelist.txt`
* Test it in the plugin with the serverMockup and your browser

### Find a rule in engine
If you need to easily search among all our rules, you can use the script `findRule.js` 
* `node engine/generation/findRule.js`
* this will prompt for your search and check among all rules if something matches with your search.
