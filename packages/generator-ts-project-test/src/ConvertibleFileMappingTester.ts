import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper, IParser, TextConverter } from "@manuth/generator-ts-project";
import { ParsableFileMappingTester } from "./ParsableFileMappingTester.js";

/**
 * Provides the functionality to test a file-mapping which is convertible.
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
export abstract class ConvertibleFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>, TParsed> extends ParsableFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>
{
    /**
     * Initializes a new instance of the {@link ConvertibleFileMappingTester `ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
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
     * Gets a component for parsing and dumping the data of the file-mapping.
     */
    public abstract get Converter(): TextConverter<TParsed>;

    /**
     * @inheritdoc
     */
    public get Parser(): IParser<TParsed>
    {
        return this.Converter;
    }

    /**
     * Gets a component for dumping the data of the file-mapping.
     */
    public get Dumper(): IDumper<TParsed>
    {
        return this.Converter;
    }

    /**
     * Dumps the specified {@link data `data`}.
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link data `data`}.
     */
    public Dump(data: TParsed): string
    {
        return this.Dumper.Dump(data);
    }

    /**
     * Dumps the specified {@link data `data`} to the file with the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to dump the specified {@link data `data`} to.
     *
     * @param data
     * The data to dump to the file with the specified {@link fileName `fileName`}.
     */
    public async DumpFile(fileName: string, data: TParsed): Promise<void>
    {
        return super.WriteFile(fileName, this.Dump(data));
    }

    /**
     * Dumps the specified {@link data `data`} to the source-file.
     *
     * @param data
     * The data to dump.
     */
    public async DumpSource(data: TParsed): Promise<void>
    {
        return this.WriteSource(this.Dump(data));
    }

    /**
     * Dumps the specified {@link data `data`} to the output-file.
     *
     * @param data
     * The data to dump.
     */
    public async DumpOutput(data: TParsed): Promise<void>
    {
        return this.WriteOutput(this.Dump(data));
    }
}
