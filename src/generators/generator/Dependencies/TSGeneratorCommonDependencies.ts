import { CommonDependencies } from "../../../NPMPackaging/Dependencies/CommonDependencies";
import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";

/**
 * Provides all common dependencies.
 */
export class TSGeneratorCommonDependencies extends CommonDependencies
{
    /**
     * Initializes a new instance of the `CommonDependencies` class.
     */
    public constructor()
    {
        super();

        this.Register(
            new PackageDependencyCollection(
                {
                    dependencies: [
                        "@manuth/extended-yo-generator"
                    ],
                    devDependencies: [
                        "yo"
                    ]
                }));
    }
}
