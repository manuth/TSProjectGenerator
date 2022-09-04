import { IDependencyCollectionOptions } from "@manuth/package-json-editor";
import { ESModuleDependencyCollection } from "../../../NPMPackaging/Dependencies/ESModuleDependencyCollection.js";

/**
 * Provides all dependencies for example-generators.
 */
export class TSGeneratorExampleDependencies extends ESModuleDependencyCollection
{
    /**
     * The name of the `chalk` package.
     */
    private static readonly chalkPackageName = "chalk";

    /**
     * Initializes a new instance of the {@link TSGeneratorExampleDependencies `TSGeneratorExampleDependencies`} class.
     *
     * @param esModule
     * A value indicating whether the ESModule dependencies are allowed.
     */
    // ToDo: Make mandatory
    public constructor(esModule = false)
    {
        super(
            {
                dependencies: [
                    "dedent",
                    TSGeneratorExampleDependencies.chalkPackageName,
                    "yosay"
                ],
                devDependencies: [
                    "@types/dedent",
                    "@types/yosay"
                ]
            },
            esModule);
    }

    /**
     * @inheritdoc
     */
    protected override get Overrides(): IDependencyCollectionOptions
    {
        return {
            dependencies: {
                [TSGeneratorExampleDependencies.chalkPackageName]: "^4.1.2"
            }
        };
    }
}
