const path = require("path");

module.exports = {
    extends: [
        require.resolve("./packages/generator-ts-project/.eslintrc.js")
    ],
    parserOptions: {
        project: [
            path.join(__dirname, "tsconfig.json"),
            path.join(__dirname, "tsconfig.eslint.json")
        ]
    }
};
