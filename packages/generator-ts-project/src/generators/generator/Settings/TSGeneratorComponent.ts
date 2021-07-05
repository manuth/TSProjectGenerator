// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator";

/**
 * Represents a component of the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 */
export enum TSGeneratorComponent
{
    /**
     * Indicates the generator example.
     */
    GeneratorExample = "example",

    /**
     * Indicates the sub-generator example.
     */
    SubGeneratorExample = "sub-example"
}
