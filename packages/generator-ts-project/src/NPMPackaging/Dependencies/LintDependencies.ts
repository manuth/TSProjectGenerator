import { PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { LintEssentials } from "./LintEssentials";

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
    }

    /**
     * @inheritdoc
     */
    protected override get DependencyNames(): PackageDependencyCollectionOptions
    {
        let result = super.DependencyNames;

        return {
            ...result,
            devDependencies: [
                ...(result.devDependencies ?? []),
                "@manuth/typescript-eslint-plugin"
            ]
        };
    }
}
