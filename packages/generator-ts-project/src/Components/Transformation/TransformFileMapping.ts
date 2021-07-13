import { FileMappingOptions, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Provides the functionality to transform and copy object-notation code.
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
export abstract class TransformFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends FileMappingOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TransformFileMapping `TransformFileMapping<TSettings, TOptions, TData>`} class.
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
    public abstract override get Source(): string;

    /**
     * Gets the data representing this file.
     */
    public get Metadata(): Promise<TData>
    {
        return (
            async () =>
            {
                return this.Parse(await this.Content);
            })();
    }

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        return this.WriteDestination(await this.Dump(await this.Transform(await this.Metadata)));
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
     * Loads the meta-data from the specified {@link text `text`}.
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the specified {@link text `text`}.
     */
    protected abstract Parse(text: string): Promise<TData>;

    /**
     * Dumps the specified {@link data `data`} as a text representing the object.
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A text representing the specified {@link data `data`}.
     */
    protected abstract Dump(data: TData): Promise<string>;
}
