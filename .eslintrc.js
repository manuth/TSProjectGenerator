const Path = require("path");

module.exports = {
    extends: [
        "plugin:@manuth/typescript/recommended-requiring-type-checking"
    ],
    env: {
        node: true
    },
    parserOptions: {
        project: [
            Path.join(__dirname, "tsconfig.json")
        ]
    }
}
