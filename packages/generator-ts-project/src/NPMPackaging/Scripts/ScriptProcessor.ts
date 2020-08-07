import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { ScriptMapping } from "./ScriptMapping";

/**
 * Provides the functionality to process scripts.
 */
export type ScriptProcessor<T extends IGeneratorSettings> =
    /**
     * Processes a script.
     *
     * @param script
     * The script to process.
     *
     * @param target
     * The resolved representation of the script-mapping.
     *
     * @param generator
     * The generator of the script-mapping.
     *
     * @returns
     * The processed script.
     */
    (script: string, target: ScriptMapping<T>, generator: IGenerator<T>) => Promise<string>;
