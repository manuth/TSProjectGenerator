import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { IScriptMapping, ITSProjectSettings, ScriptMapping, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
import { Package, PackageDependencyCollection } from "@manuth/package-json-editor";
import { Constants } from "./Constants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MyTSProjectGenerator } from "./MyTSProjectGenerator";

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
            ...this.GetBaseScripts(this.Base.MiscScripts).map(
                (script) =>
                {
                    let scriptMapping = new ScriptMapping(this.Generator, this.ScriptSource, script);

                    if (scriptMapping.Destination === prepareScriptName)
                    {
                        return prepareScriptName;
                    }
                    else
                    {
                        return script;
                    }
                }),
            "patch-ts"
        ];
    }

    /**
     * Gets the base of the file-mapping.
     */
    protected get Base(): TSProjectPackageFileMapping<TSettings, TOptions>
    {
        return this.baseFileMapping;
    }

    /**
     * @inheritdoc
     */
    protected override get ScriptSource(): Package
    {
        return Constants.Package;
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
    protected GetBaseScripts(scriptMappings: Array<IScriptMapping<TSettings, TOptions> | string>): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return scriptMappings.map(
            (script) =>
            {
                let scriptMapping: IScriptMapping<TSettings, TOptions>;

                if (typeof script === "string")
                {
                    scriptMapping = {
                        Destination: script
                    };
                }
                else
                {
                    scriptMapping = {
                        ID: script.ID,
                        Destination: script.Destination
                    };
                }

                scriptMapping.Processor = async (script, scriptMapping) =>
                {
                    return this.Base.ScriptMappingCollection.Get(
                        (baseScriptMapping: ScriptMapping<TSettings, TOptions>) =>
                        {
                            return baseScriptMapping.Destination === scriptMapping.Destination;
                        }).Processor();
                };

                return scriptMapping;
            });
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

        result.Register(
            new PackageDependencyCollection(
                Constants.Package,
                {
                    devDependencies: [
                        "@types/ts-nameof",
                        "ts-nameof",
                        "ts-node",
                        "ts-patch"
                    ]
                }),
            true);

        return result;
    }
}
