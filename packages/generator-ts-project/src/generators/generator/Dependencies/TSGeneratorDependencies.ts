import { MyPackageDependencyCollection } from "../../../NPMPackaging/Dependencies/MyPackageDependencyCollection.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";

/**
 * Provides all common dependencies for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 */
export class TSGeneratorDependencies extends MyPackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link TSGeneratorDependencies `TSGeneratorDependencies`} class.
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
