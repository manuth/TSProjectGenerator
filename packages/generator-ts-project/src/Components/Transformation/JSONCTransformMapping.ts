import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONCConverter } from "./Conversion/JSONCConverter.js";
import { TextConverter } from "./Conversion/TextConverter.js";
import { ParsedFileMapping } from "./ParsedFileMapping.js";

/**
 * Provides the functionality to transform and copy JSON-code.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TData
 * The type of the data to process.
 */
export abstract class JSONCTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends ParsedFileMapping<TSettings, TOptions, TData>
{
    /**
     * Initializes a new instance of the {@link JSONCTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Converter(): TextConverter<TData>
    {
        return new JSONCConverter();
    }
}
