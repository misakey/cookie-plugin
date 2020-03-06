module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "webextensions": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/recommended",
        "airbnb",
        "airbnb/hooks"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    "settings": {
        "import/resolver": {
            "node": {
            "paths": [
                "src/addon"
            ]
            },
        },
    },
    "plugins": [
        "react",
        "jest",
    ],
    "rules": {
        "react/jsx-fragments": "off",
        "react/jsx-props-no-spreading": "off",
        "react/jsx-props-no-spreading": "off",
        "react/jsx-filename-extension": [
            1,
            {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".md"
                ]
            }
        ],
        "react/forbid-prop-types": [
            1,
            {
                "forbid": [
                    "any",
                    "array"
                ]
            }
        ],
        "import/namespace": ["error", { "allowComputed": true }],
        "import/prefer-default-export": 0,
        "object-curly-newline": "off",
        "no-console": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error"
    }
};