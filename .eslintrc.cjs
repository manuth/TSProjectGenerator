const { join } = require("node:path");

module.exports = {
    extends: [
        require.resolve("./packages/generator-ts-project/.eslintrc.cjs")
    ],
    parserOptions: {
        project: [
            join(__dirname, "tsconfig.json"),
            join(__dirname, "tsconfig.eslint.json")
        ]
    }
};
