import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ScriptMapping } from "./ScriptMapping.js";

/**
 * Provides the functionality to process scripts.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export type ScriptProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> =
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
    (script: string, target: ScriptMapping<TSettings, TOptions>, generator: IGenerator<TSettings, TOptions>) => Promise<string>;
