import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ParsedFileMapping, TextConverter } from "@manuth/generator-ts-project";
import { ConvertibleFileMappingTester } from "./ConvertibleFileMappingTester.js";

/**
 * Represents a file-mapping of a parsable file.
 *
 * @template TGenerator
 * The type of the generator for testing the file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TFileMapping
 * The type of the file-mapping to test.
 *
 * @template TParsed
 * The type of the parsed representation of the file.
 */
export class ParsedFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends ParsedFileMapping<TSettings, TOptions, TParsed>, TParsed> extends ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>
{
    /**
     * Initializes a new instance of the {@link ParsedFileMappingTester `ParsedFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * @inheritdoc
     */
    public get Converter(): TextConverter<TParsed>
    {
        return this.FileMappingOptions.Converter;
    }
}
