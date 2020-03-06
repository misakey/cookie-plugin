### Rules generation

`cliqz/adblocker` use adblock rules format [Adblock Filter cheatsheet](https://adblockplus.org/filter-cheatsheet). 

* The script `createEngine.js` generate an engine (see [@cliqz/adblocker](https://www.npmjs.com/package/@cliqz/adblocker)) based on the list of rules contained in `lists`. 
* There is remote lists available on the web and custom list of rules (`/lists/custom`).

### Add a blocking rule
* format the rule according to [Adblock Filter cheatsheet](https://adblockplus.org/filter-cheatsheet) (Adblock Plus specific pseudo-selectors not supported)
* Add it to the file `engine/generation/resources/banners.txt` for cosmetic rules and to `engine/generation/resources/network*.txt` for networkRules
* generate the new engine.bytes with `yarn generate-engine`
* Test it in the plugin with the server mockup and your browser (See root `README.md > Addon > Test generated files` and `Tests on browser` section
)

### Remove a blocking rule
* Add the rule to the file `engine/generation/resources/whitelist.txt`
* generate the new engine.bytes with `yarn generate-engine`
* Test it in the plugin with the serverMockup and your browser

### Find a rule in engine
If you need to easily search among all our rules, you can use the script `findRule.js` 
* `node engine/generation/findRule.js`
* this will prompt for your search and check among all rules if something matches with your search.
