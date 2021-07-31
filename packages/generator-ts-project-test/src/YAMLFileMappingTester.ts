import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper, YAMLConverter } from "@manuth/generator-ts-project";
import { Document } from "yaml";
import { ConvertibleFileMappingTester } from "./ConvertibleFileMappingTester";

/**
 * Provides the functionality to test yaml file-mappings.
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
 */
export class YAMLFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, Document.Parsed[]>
{
    /**
     * Initializes a new instance of the {@link YAMLFileMappingTester `YAMLFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
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
    public get Converter(): YAMLConverter
    {
        return new YAMLConverter();
    }

    /**
     * @inheritdoc
     */
    public override get Dumper(): IDumper<Array<Document | Document.Parsed>>
    {
        return this.Converter;
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link data `data`}.
     */
    public override Dump(data: Array<Document | Document.Parsed>): string
    {
        return this.Dumper.Dump(data);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to dump to the file with the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to dump the specified {@link data `data`} to.
     */
    public override async DumpFile(data: Array<Document | Document.Parsed>, fileName: string): Promise<void>
    {
        return super.WriteFile(this.Dump(data), fileName);
    }

    /**
     * Dumps the specified {@link data `data`} to the source-file.
     *
     * @param data
     * The data to dump.
     */
    public override async DumpSource(data: Array<Document | Document.Parsed>): Promise<void>
    {
        return this.WriteSource(this.Dump(data));
    }

    /**
     * Dumps the specified {@link data `data`} to the output-file.
     *
     * @param data
     * The data to dump.
     */
    public override async DumpOutput(data: Array<Document | Document.Parsed>): Promise<void>
    {
        return this.WriteOutput(this.Dump(data));
    }
}
