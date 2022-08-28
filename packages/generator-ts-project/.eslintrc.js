const { join } = require("path");
const { PluginName, PresetName } = require("@manuth/eslint-plugin-typescript");

module.exports = {
    extends: [
        `plugin:${PluginName}/${PresetName.RecommendedWithTypeChecking}`
    ],
    root: true,
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        project: [
            join(__dirname, "tsconfig.json"),
            join(__dirname, "tsconfig.eslint.json"),
            join(__dirname, "src", "tests", "tsconfig.json")
        ]
    },
    ignorePatterns: [
        "**/*.test-d.ts"
    ]
};
