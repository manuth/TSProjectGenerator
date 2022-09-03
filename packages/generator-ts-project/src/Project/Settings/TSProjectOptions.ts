import { GeneratorOptions } from "@manuth/extended-yo-generator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TSProjectGenerator } from "../TSProjectGenerator.js";

/**
 * Provides options for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}.
 */
export interface ITSProjectOptions extends GeneratorOptions
{
    /**
     * A value indicating whether the `cleanup` task should be skipped.
     */
    skipCleanup?: boolean;
}
