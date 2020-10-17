const { join } = require("path");

module.exports = {
    extends: [
        require.resolve("./packages/generator-ts-project/.eslintrc.js")
    ],
    parserOptions: {
        project: [
            join(__dirname, "tsconfig.json"),
            join(__dirname, "tsconfig.eslint.json")
        ]
    }
};
