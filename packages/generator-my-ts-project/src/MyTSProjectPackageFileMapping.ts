import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { IScriptMapping, ITSProjectSettings, ScriptMapping, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
import { Package, PackageDependencyCollection } from "@manuth/package-json-editor";
import { Constants } from "./Constants.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MyTSProjectGenerator } from "./MyTSProjectGenerator.js";

/**
 * Represents a file-mapping for the `package.json` file of {@link MyTSProjectGenerator `MyTSProjectGenerator<T>`}s.
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
     * The base of the file-mapping.
     */
    private baseFileMapping: TSProjectPackageFileMapping<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link MyTSProjectPackageFileMappingFactory `MyTSProjectPackageFileMappingFactory<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param baseFileMapping
     * The base of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, baseFileMapping: TSProjectPackageFileMapping<TSettings, TOptions>)
    {
        super(generator);
        this.baseFileMapping = baseFileMapping;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The object to dump.
     */
    public override GetSourceObject(): Promise<Package>
    {
        return this.Base.GetPackage();
    }

    /**
     * @inheritdoc
     */
    public override get TypeScriptScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return this.GetBaseScripts(this.Base.TypeScriptScripts);
    }

    /**
     * @inheritdoc
     */
    public override get LintScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return this.GetBaseScripts(this.Base.LintScripts);
    }

    /**
     * @inheritdoc
     */
    public override get MiscScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        let prepareScriptName = "prepare";

        return [
            ...this.Base.MiscScripts.flatMap(
                (script) =>
                {
                    let scriptMapping = new ScriptMapping(this.Generator, this.Base.ScriptSource, script);

                    if (scriptMapping.Destination === prepareScriptName)
                    {
                        return {
                            Destination: scriptMapping.Destination,
                            Processor: async () => scriptMapping.SourcePackage.Scripts.Get(scriptMapping.Source)
                        };
                    }
                    else
                    {
                        return this.GetBaseScript(script);
                    }
                }),
            {
                Destination: "patch-ts",
                Processor: async (_, target) =>
                {
                    return this.Base.ScriptSource.Scripts.Get(target.Destination);
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public override get ScriptSource(): Package
    {
        return Constants.Package;
    }

    /**
     * Gets the base of the file-mapping.
     */
    protected get Base(): TSProjectPackageFileMapping<TSettings, TOptions>
    {
        return this.baseFileMapping;
    }

    /**
     * Gets scripts from the base file-mapping.
     *
     * @param scriptMappings
     * The scripts to retrieve from the base file-mapping.
     *
     * @returns
     * The scripts retrieved from the base file-mapping.
     */
    protected GetBaseScripts(scriptMappings: Array<IScriptMapping<TSettings, TOptions> | string>): Array<IScriptMapping<TSettings, TOptions>>
    {
        return scriptMappings.map(
            (script) =>
            {
                return this.GetBaseScript(script);
            });
    }

    /**
     * Gets a script from the base file-mapping.
     *
     * @param scriptMapping
     * The script to retrieve from the base file-mapping.
     *
     * @returns
     * The script retrieved from the base file-mapping.
     */
    protected GetBaseScript(scriptMapping: IScriptMapping<TSettings, TOptions> | string): IScriptMapping<TSettings, TOptions>
    {
        let result: IScriptMapping<TSettings, TOptions>;

        if (typeof scriptMapping === "string")
        {
            result = {
                Destination: scriptMapping
            };
        }
        else
        {
            result = {
                ID: scriptMapping.ID,
                Destination: scriptMapping.Destination
            };
        }

        result.Processor = async (script, scriptMapping) =>
        {
            return this.Base.ScriptMappingCollection.Get(
                (baseScriptMapping: ScriptMapping<TSettings, TOptions>) =>
                {
                    return baseScriptMapping.Destination === result.Destination;
                }).Processor();
        };

        return result;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The loaded package.
     */
    protected override async LoadPackage(): Promise<Package>
    {
        let result = await this.Base.GetPackage();

        result.Register(
            new PackageDependencyCollection(
                this.Base.ScriptSource,
                {
                    devDependencies: [
                        "@types/ts-nameof",
                        "ts-nameof",
                        "ts-patch"
                    ]
                }),
            true);

        return result;
    }
}
