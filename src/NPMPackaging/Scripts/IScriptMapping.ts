import { IGeneratorSettings, Resolvable } from "@manuth/extended-yo-generator";
import { ScriptMapping } from "./ScriptMapping";
import { ScriptProcessor } from "./ScriptProcessor";

/**
 * Represents a script-mapping.
 */
export interface IScriptMapping<T extends IGeneratorSettings>
{
    /**
     * The source-script.
     */
    Source: Resolvable<ScriptMapping<T>, T, string>;

    /**
     * The name of the destination-script.
     */
    Destination: Resolvable<ScriptMapping<T>, T, string>;

    /**
     * A component for manipulating the script.
     */
    Processor?: ScriptProcessor<T>;
}
