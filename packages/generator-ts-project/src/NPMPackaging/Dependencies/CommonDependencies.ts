import { BuildDependencies } from "./BuildDependencies";
import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides all common dependencies.
 */
export class CommonDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `CommonDependencies` class.
     */
    public constructor()
    {
        super(
            {
                devDependencies: [
                    "@types/mocha",
                    "@types/node",
                    "mocha",
                    "rimraf",
                    "source-map-support"
                ]
            });

        this.Register(new BuildDependencies());
    }
}
