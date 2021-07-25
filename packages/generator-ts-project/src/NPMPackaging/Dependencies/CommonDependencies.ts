import { PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { BuildDependencies } from "./BuildDependencies";

/**
 * Provides all common dependencies.
 */
export class CommonDependencies extends BuildDependencies
{
    /**
     * Initializes a new instance of the {@link CommonDependencies `CommonDependencies`} class.
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
                "@types/mocha",
                "@types/node",
                "mocha",
                "rimraf",
                "source-map-support"
            ]
        };
    }
}
