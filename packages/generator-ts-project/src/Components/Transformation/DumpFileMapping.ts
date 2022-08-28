import { FileMappingOptions, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper } from "./Conversion/IDumper.js";

/**
 * Represents a file-mapping which is created by dumping an object.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TData
 * The type of the data to dump.
 */
export abstract class DumpFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends FileMappingOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link DumpFileMapping `DumpFileMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets a component for dumping {@link TData `TData`}-objects.
     */
    public abstract get Dumper(): IDumper<TData>;

    /**
     * Gets the object to dump.
     *
     * @returns
     * The object to dump.
     */
    public abstract GetSourceObject(): Promise<TData>;

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        return this.WriteOutput(this.Dump(await this.GetOutputObject()));
    }

    /**
     * Processes the specified {@link data `data`}.
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    protected async Transform(data: TData): Promise<TData>
    {
        return data;
    }

    /**
     * Gets the object to write to the output file.
     *
     * @returns
     * The object to write to the output file.
     */
    protected async GetOutputObject(): Promise<TData>
    {
        return this.Transform(await this.GetSourceObject());
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
    protected Dump(data: TData): string
    {
        return this.Dumper.Dump(data);
    }
}
