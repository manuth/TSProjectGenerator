import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper } from "./Conversion/IDumper.js";
import { IParser } from "./Conversion/IParser.js";
import { TextConverter } from "./Conversion/TextConverter.js";
import { DumpFileMapping } from "./DumpFileMapping.js";

/**
 * Provides the functionality to parse, transform and dump a file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TData
 * The type of the data to parse and dump.
 */
export abstract class ParsedFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends DumpFileMapping<TSettings, TOptions, TData>
{
    /**
     * Initializes a new instance of the {@link ParsedFileMapping `ParsedFileMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets a component for parsing and dumping objects.
     */
    public abstract get Converter(): TextConverter<TData>;

    /**
     * Gets a component for parsing objects.
     */
    public get Parser(): IParser<TData>
    {
        return this.Converter;
    }

    /**
     * Gets a component for dumping objects.
     */
    public get Dumper(): IDumper<TData>
    {
        return this.Converter;
    }

    /**
     * @inheritdoc
     */
    public abstract override get Source(): string;

    /**
     * @inheritdoc
     *
     * @returns
     * The object to dump.
     */
    public override async GetSourceObject(): Promise<TData>
    {
        return this.Parser.Parse(await this.ReadSource());
    }
}
