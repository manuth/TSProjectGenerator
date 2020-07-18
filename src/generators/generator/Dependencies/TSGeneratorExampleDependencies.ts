import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";

/**
 * Provides all dependencies for example-generators.
 */
export class TSGeneratorExampleDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `TSGeneratorExampleDependencies` class.
     */
    public constructor()
    {
        super(
            {
                dependencies: [
                    "chalk",
                    "dedent",
                    "yosay"
                ],
                devDependencies: [
                    "@types/dedent",
                    "@types/yosay"
                ]
            });
    }
}
