import { BuildDependencies } from "./BuildDependencies";
import { MyPackageDependencyCollection } from "./MyPackageDependencyCollection";

/**
 * Provides all common dependencies.
 */
export class CommonDependencies extends MyPackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link CommonDependencies `CommonDependencies`} class.
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
