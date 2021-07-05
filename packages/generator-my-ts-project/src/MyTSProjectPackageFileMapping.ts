import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { IScriptMapping, ITSProjectSettings, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "./Constants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MyTSProjectGenerator } from "./MyTSProjectGenerator";

/**
 * Represents a file-mapping for the `package.json` file of {@link MyTSProjectGenerator `MyTSProjectGenerator`}s containing dependencies for using `ts-patch`.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class MyTSProjectPackageFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectPackageFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link MyTSProjectPackageFileMapping `MyTSProjectPackageFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected override get MiscScripts(): Promise<Array<IScriptMapping<TSettings, TOptions> | string>>
    {
        let baseScripts = super.MiscScripts;

        return (
            async (): Promise<Array<IScriptMapping<TSettings, TOptions> | string>> =>
            {
                let prepareScriptName = "prepare";
                let scripts: Array<IScriptMapping<TSettings, TOptions> | string> = [];

                for (let script of await baseScripts)
                {
                    if (
                        typeof script === "string" ?
                            script === prepareScriptName :
                            script.Destination === prepareScriptName)
                    {
                        scripts.push(prepareScriptName);
                    }
                    else
                    {
                        scripts.push(script);
                    }
                }

                scripts.push("patchTypeScript");
                return scripts;
            })();
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The loaded package.
     */
    protected override async LoadPackage(): Promise<Package>
    {
        let result = await super.LoadPackage();

        let dependencies = [
            "@types/ts-nameof",
            "ts-nameof",
            "ts-patch"
        ];

        for (let dependency of dependencies)
        {
            if (result.DevelpomentDependencies.Has(dependency))
            {
                result.DevelpomentDependencies.Remove(dependency);
            }

            result.DevelpomentDependencies.Add(dependency, Constants.Dependencies.Get(dependency));
        }

        return result;
    }
}
