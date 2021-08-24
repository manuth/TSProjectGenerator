import { MyPackageDependencyCollection } from "./MyPackageDependencyCollection";

/**
 * Provides a set of all dependencies required for performing linting.
 */
export class LintEssentials extends MyPackageDependencyCollection
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
                    "@manuth/eslint-plugin-typescript"
                ]
            });
    }
}
