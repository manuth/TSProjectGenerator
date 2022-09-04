import { IDependencyCollectionOptions } from "@manuth/package-json-editor";
import { ESModuleDependencyCollection } from "../../../NPMPackaging/Dependencies/ESModuleDependencyCollection.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";

/**
 * Provides all common dependencies for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 */
export class TSGeneratorDependencies extends ESModuleDependencyCollection
{
    /**
     * The name of the generator package.
     */
    private static readonly generatorBasePackageName = "@manuth/extended-yo-generator";

    /**
     * Initializes a new instance of the {@link TSGeneratorDependencies `TSGeneratorDependencies`} class.
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
                    TSGeneratorDependencies.generatorBasePackageName
                ],
                devDependencies: [
                    "yo"
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
                [TSGeneratorDependencies.generatorBasePackageName]: "^11.0.7"
            }
        };
    }
}
