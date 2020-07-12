const Path = require("path");

module.exports = {
    extends: [
        "plugin:@manuth/typescript/recommended-requiring-type-checking"
    ],
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        project: [
            Path.join(__dirname, "tsconfig.json"),
            Path.join(__dirname, "tsconfig.eslint.json")
        ]
    },
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                args: "none"
            }
        ],
        "@typescript-eslint/explicit-module-boundary-types": [
            "warn",
            {
                allowArgumentsExplicitlyTypedAsAny: true
            }
        ]
    }
};
