const path = require("path");

module.exports = {
    extends: [
        "plugin:@manuth/typescript/recommended-requiring-type-checking"
    ],
    root: true,
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        project: [
            path.join(__dirname, "tsconfig.json"),
            path.join(__dirname, "tsconfig.eslint.json"),
            path.join(__dirname, "src", "tests", "tsconfig.json")
        ]
    },
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": [
            "warn",
            {
                allowArgumentsExplicitlyTypedAsAny: true
            }
        ],
        "@typescript-eslint/no-dynamic-delete": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                args: "none"
            }
        ],
        "jsdoc/require-jsdoc": [
            "warn",
            {
                require: {
                    ClassDeclaration: true,
                    ClassExpression: false,
                    ArrowFunctionExpression: false,
                    FunctionDeclaration: true,
                    FunctionExpression: false,
                    MethodDefinition: true
                },
                contexts: [
                    "TSEnumDeclaration",
                    "TSEnumMember",
                    "TSInterfaceDeclaration",
                    "ClassProperty",
                    "TSTypeAliasDeclaration",
                    "TSPropertySignature",
                    "TSAbstractMethodDefinition",
                    "TSCallSignatureDeclaration",
                    "TSConstructSignatureDeclaration",
                    "TSMethodSignature",
                    "TSDeclareFunction"
                ]
            }
        ]
    }
};
