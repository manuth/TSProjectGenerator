import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides a set of all dependencies required for performing linting.
 */
export class LintEssentials extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link LintEssentials `LintEssentials`} class.
     */
    public constructor()
    {
        super(
            {
                devDependencies: [
                    "eslint",
                    "eslint-plugin-deprecation",
                    "eslint-plugin-import",
                    "eslint-plugin-jsdoc",
                    "@manuth/eslint-plugin-typescript",
                    "@typescript-eslint/eslint-plugin",
                    "@typescript-eslint/parser",
                    "@typescript-eslint/eslint-plugin-tslint",
                    "tslint"
                ]
            });
    }
}
