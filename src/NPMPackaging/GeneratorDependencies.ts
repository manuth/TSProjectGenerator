import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides all dependencies required for creating a generator.
 */
export class GeneratorDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `GeneratorDependencies` class.
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
