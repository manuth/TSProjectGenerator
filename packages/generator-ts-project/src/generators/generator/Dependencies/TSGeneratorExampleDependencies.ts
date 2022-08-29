import { Dictionary } from "@manuth/package-json-editor";
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
                    "dedent",
                    "yosay"
                ],
                devDependencies: [
                    "@types/dedent",
                    "@types/yosay"
                ]
            });
    }

    /**
     * @inheritdoc
     */
    public override get Dependencies(): Dictionary<string, string>
    {
        let result = super.Dependencies;
        result.Add("chalk", "^4.1.2");
        return result;
    }
}
