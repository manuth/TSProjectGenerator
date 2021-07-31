import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Document } from "yaml";
import { YAMLConverter } from "./Conversion/YAMLConverter";
import { ParsedFileMapping } from "./ParsedFileMapping";

/**
 * Provides the functionality to transform and copy YAML-code.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class YAMLTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends ParsedFileMapping<TSettings, TOptions, Document.Parsed[]>
{
    /**
     * Initializes a new instance of the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class.
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
    public get Converter(): YAMLConverter
    {
        return new YAMLConverter();
    }
}
