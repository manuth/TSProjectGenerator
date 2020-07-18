import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";

/**
 * Provides all common dependencies.
 */
export class TSGeneratorDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `CommonDependencies` class.
     */
    public constructor()
    {
        super(
            {
                dependencies: [
                    "@manuth/extended-yo-generator"
                ],
                devDependencies: [
                    "yo"
                ]
            });
    }
}
