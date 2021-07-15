import { FileMappingOptions, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper } from "./Conversion/IDumper";

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
     * Gets the object to dump.
     */
    public abstract get SourceObject(): Promise<TData>;

    /**
     * Gets a component for dumping {@link TData `TData`}-objects.
     */
    public abstract get Dumper(): IDumper<TData>;

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        return this.WriteDestination(this.Dumper.Dump(await this.Transform(await this.SourceObject)));
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
}
