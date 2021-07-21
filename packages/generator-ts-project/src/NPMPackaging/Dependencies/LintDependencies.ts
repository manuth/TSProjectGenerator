import { LintEssentials } from "./LintEssentials";
import { MyPackageDependencyCollection } from "./MyPackageDependencyCollection";

/**
 * Provides a set of all dependencies for performing linting.
 */
export class LintDependencies extends LintEssentials
{
    /**
     * Initializes a new instance of the {@link LintDependencies `LintDependencies`} class.
     */
    public constructor()
    {
        super();

        this.Register(
            new MyPackageDependencyCollection(
                {
                    devDependencies: [
                        "@manuth/typescript-eslint-plugin"
                    ]
                }));
    }
}
