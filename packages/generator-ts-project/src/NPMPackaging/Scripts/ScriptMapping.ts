import { isNullOrUndefined } from "util";
import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { PropertyResolver } from "@manuth/extended-yo-generator/lib/Components/Resolving/PropertyResolver";
import { IScriptMapping } from "./IScriptMapping";
import { ScriptProcessor } from "./ScriptProcessor";

/**
 * Represents a script-mapping for copying npm-scripts.
 */
export class ScriptMapping<T extends IGeneratorSettings> extends PropertyResolver<IScriptMapping<T>, ScriptMapping<T>, T>
{
    /**
     * Initializes a new instance of the `ScriptMapping<T>` class.
     *
     * @param generator
     * The generator of the script-mapping
     *
     * @param scriptInfo
     * A component which provides information about the script.
     */
    public constructor(generator: IGenerator<T>, scriptInfo: string | IScriptMapping<T>)
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
    public get Source(): Promise<string>
    {
        return this.ResolveProperty(this, this.Object.Source);
    }

    /**
     * Gets the name of the destination-script.
     */
    public get Destination(): Promise<string>
    {
        return this.ResolveProperty(this, this.Object.Destination);
    }

    /**
     * Gets a component for manipulating the script.
     */
    protected get Processor(): ScriptProcessor<T>
    {
        return async (script, target, generator) =>
        {
            if (isNullOrUndefined(this.Object.Processor))
            {
                return script;
            }
            else
            {
                return this.Object.Processor(script, target, generator);
            }
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
