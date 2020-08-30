import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";

/**
 * Provides all common dependencies for `TSGenerator`s.
 */
export class TSGeneratorDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `TSGeneratorDependencies` class.
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
