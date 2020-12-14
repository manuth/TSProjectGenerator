import { LintEssentials } from "./LintEssentials";
import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides a set of all dependencies for performing linting.
 */
export class LintDependencies extends LintEssentials
{
    /**
     * Initializes a new instance of the `LintDependencies` class.
     */
    public constructor()
    {
        super();

        this.Register(
            new PackageDependencyCollection(
                {
                    devDependencies: [
                        "@manuth/typescript-eslint-plugin"
                    ]
                }));
    }
}
