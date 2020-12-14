import { GeneratorOptions, IGenerator, IGeneratorSettings, PropertyResolver } from "@manuth/extended-yo-generator";
import { IScriptMapping } from "./IScriptMapping";
import { ScriptProcessor } from "./ScriptProcessor";

/**
 * Represents a script-mapping for copying npm-scripts.
 */
export class ScriptMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends PropertyResolver<IScriptMapping<TSettings, TOptions>, ScriptMapping<TSettings, TOptions>, TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `ScriptMapping` class.
     *
     * @param generator
     * The generator of the script-mapping
     *
     * @param scriptInfo
     * A component which provides information about the script.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, scriptInfo: string | IScriptMapping<TSettings, TOptions>)
    {
        super(
            generator,
            typeof scriptInfo === "string" ?
            {
                Source: scriptInfo,
                Destination: scriptInfo
            } :
            scriptInfo);
    }

    /**
     * Gets the name of the source-script.
     */
    public get Source(): string
    {
        return this.ResolveProperty(this, this.Object.Source);
    }

    /**
     * Gets the name of the destination-script.
     */
    public get Destination(): string
    {
        return this.ResolveProperty(this, this.Object.Destination);
    }

    /**
     * Gets a component for manipulating the script.
     */
    protected get Processor(): ScriptProcessor<TSettings, TOptions>
    {
        return async (script, target, generator) =>
        {
            return this.Object.Processor?.(script, target, generator) ?? script;
        };
    }

    /**
     * Manipulates the script accordingly.
     *
     * @param script
     * The script to process.
     *
     * @returns
     * The manipulated script.
     */
    public Process(script: string): Promise<string>
    {
        return this.Processor(script, this, this.Generator);
    }
}
