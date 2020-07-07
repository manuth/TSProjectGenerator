import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides a set of all dependencies required for performing linting.
 */
export class LintDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `LintDependencies` class.
     */
    public constructor()
    {
        super(
            {
                devDependencies: [
                    "eslint",
                    "eslint-plugin-import",
                    "eslint-plugin-jsdoc",
                    "@manuth/eslint-plugin-typescript",
                    "@typescript-eslint/eslint-plugin",
                    "@typescript-eslint/parser",
                    "@typescript-eslint/eslint-plugin-tslint",
                    "tslint",
                    "typescript-eslint-plugin"
                ]
            });
    }
}
