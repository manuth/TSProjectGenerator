import { MyPackageDependencyCollection } from "../../../NPMPackaging/Dependencies/MyPackageDependencyCollection.js";

/**
 * Provides all dependencies for example-generators.
 */
export class TSGeneratorExampleDependencies extends MyPackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link TSGeneratorExampleDependencies `TSGeneratorExampleDependencies`} class.
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
