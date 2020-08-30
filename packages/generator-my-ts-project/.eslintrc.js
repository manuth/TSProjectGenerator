const path = require("path");

module.exports = {
    parserOptions: {
        project: [
            path.join(__dirname, "tsconfig.json"),
            path.join(__dirname, "tsconfig.eslint.json"),
            path.join(__dirname, "src", "tests", "tsconfig.json")
        ]
    }
};
