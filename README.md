
This is the code source for Misakey Cookie Webextension.

#### Launch

This project uses [react-scripts-webextension](https://github.com/constfun/create-react-WebExtension)

##### Dev mode: 
* `TARGET_BROWSER=firefox yarn start`.
* Available value for `TARGET_BROWSER`: `['chrome', 'firefox']`
* Default value: `'firefox'`
* output folder in `build/dev`

##### Production mode:
* `TARGET_BROWSER=firefox make build`
* Available value for `TARGET_BROWSER`: `['chrome', 'firefox']`
* Default value: `'firefox'`
* output folder in `build/prod`

##### Production zips:

###### Build zips
* `make build-zip`
* use `VERSION=<myversion> make build-zip` to get zip output with version in the name
* output directly in `build`


###### Source code zip
* `make zip-plugin-source-code` --> generate a zip of the source_code for reviewers 
* output folder in `build/source_code.zip`

#### Tests on browser

##### Chrome

- Go to Menu -> More tools -> Extensions
- Enable `Developer mode`
- Upload the generated folder (`chrome` or `firefox`) with `Load unpackaged extension`
- The extension should be loaded 

##### Firefox

- Go to `about:debugging` in the url
- Upload the generated folder (`chrome` or `firefox`) with `Load temporary module`
- The extension should be loaded 
- Enable `debugging of extensions`
  

### Addon:

#### Background script (`/src/addon/background`)

The main purpose of this script is to block unwanted requests before they are launched in the client browser. 
It is based on the `@cliqz/adblocker` library.


###### Add new blocking rules
See [engine README.md](engine/README.md) in `./engine`

###### Test new rules 
To test the new rules inside the plugin before pushing on the repo: 
* Serve the files with `serverMockup.js`:
  * `yarn start-server-mockup`
* Replace RESOURCE_URL in `src/addon/background/config.js` by `'http://localhost:3005'`
* Test the plugin on your browser as explained in [Test on browser](#tests-on-browser)

To see how to add or remove rules in `engine.bytes` and `mainPurpose.json` file, see README.md in folder `engine`.

#### Content script (`/src/addon/content`)

The main purpose of this script is to hide cookies banners and other annoying content on the current page of the browser. 
It is also based on the `@cliqz/adblocker` library.

#### Popup (`/src/addon/popup`)

This folder stands for what is displayed in the extension popup in the browser. 

#### Manifest

The file `manifest.json` indicates to the browser where to find each resources to execute. 
It also handle permissions of the web extension and other configuration keys.
It has to be at the root of the final folder (build).

We generate the manifest file from a template according to target browser (script in `/manifest`)


### Lint and test

```shell
# Lint
yarn lint 
```

### Git hook

A pre-commit hook is available to automatically run the linter before any commit
(this way we can avoid "lint" commits)

To install it go to the `devtools/git` folder and run `./pre-commit-install.sh`

## License

The code is published under GPLv3. More info in the [LICENSE](LICENSE) file.
