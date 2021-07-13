import { GeneratorOptions, IGenerator, IGeneratorSettings, PropertyResolver, Resolvable } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { IScriptMapping } from "./IScriptMapping";
import { ScriptProcessor } from "./ScriptProcessor";

/**
 * Represents a script-mapping for copying npm-scripts.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ScriptMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends PropertyResolver<IScriptMapping<TSettings, TOptions>, ScriptMapping<TSettings, TOptions>, TSettings, TOptions> implements IScriptMapping<TSettings, TOptions>
{
    /**
     * The package to load the script-source from.
     */
    private sourcePackage: Promise<Package>;

    /**
     * Initializes a new instance of the {@link ScriptMapping `ScriptMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the script-mapping
     *
     * @param sourcePackage
     * The package to load the script-source from.
     *
     * @param scriptInfo
     * A component which provides information about the script.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, sourcePackage: Promise<Package>, scriptInfo: string | IScriptMapping<TSettings, TOptions>)
    {
        super(
            generator,
            typeof scriptInfo === "string" ?
                {
                    Source: scriptInfo,
                    Destination: scriptInfo
                } :
                scriptInfo);

        this.sourcePackage = sourcePackage;
    }

    /**
     * Gets the package to load the script-source from.
     */
    public get SourcePackage(): Promise<Package>
    {
        return this.sourcePackage;
    }

    /**
     * Gets the name of the source-script.
     */
    public get Source(): string
    {
        return this.ResolveProperty(this, this.Object.Source);
    }

    /**
     * @inheritdoc
     */
    public set Source(value: Resolvable<ScriptMapping<TSettings, TOptions>, TSettings, TOptions, string>)
    {
        this.Object.Source = value;
    }

    /**
     * Gets the name of the destination-script.
     */
    public get Destination(): string
    {
        return this.ResolveProperty(this, this.Object.Destination);
    }

    /**
     * @inheritdoc
     */
    public set Destination(value: Resolvable<ScriptMapping<TSettings, TOptions>, TSettings, TOptions, string>)
    {
        this.Object.Destination = value;
    }

    /**
     * Gets a component for manipulating the script.
     */
    public get Processor(): () => Promise<string>
    {
        return async () =>
        {
            let script;

            if (this.Source)
            {
                script = (await this.SourcePackage).Scripts.Get(this.Source);
            }
            else
            {
                script = null;
            }

            return this.Object.Processor?.(script, this, this.Generator) ?? script;
        };
    }

    /**
     * @inheritdoc
     */
    public set Processor(value: ScriptProcessor<TSettings, TOptions>)
    {
        this.Object.Processor = value;
    }

    /**
     * @inheritdoc
     */
    public get Result(): IScriptMapping<TSettings, TOptions>
    {
        return this;
    }
}
