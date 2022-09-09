import { GeneratorOptions, IGeneratorSettings, IUniqueObject, Resolvable } from "@manuth/extended-yo-generator";
import { ScriptMapping } from "./ScriptMapping.js";
import { ScriptProcessor } from "./ScriptProcessor.js";

/**
 * Represents a script-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IScriptMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends IUniqueObject
{
    /**
     * The source-script.
     */
    Source?: Resolvable<ScriptMapping<TSettings, TOptions>, TSettings, TOptions, string>;

    /**
     * The name of the destination-script.
     */
    Destination: Resolvable<ScriptMapping<TSettings, TOptions>, TSettings, TOptions, string>;

    /**
     * A component for manipulating the script.
     */
    Processor?: ScriptProcessor<TSettings, TOptions>;
}
