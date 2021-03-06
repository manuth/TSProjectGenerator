import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingBase } from "../FileMappingBase";

/**
 * Provides the functionality to transform and copy object-notation code.
 */
export abstract class TransformFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends FileMappingBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TransformFileMapping` class.
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
    public abstract get Source(): string;

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
    public async Processor(): Promise<void>
    {
        return this.WriteDestination(await this.Dump(await this.Transform(await this.Metadata)));
    }

    /**
     * Processes the specified `data`.
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
     * Loads the meta-data from the `text`.
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the `text`.
     */
    protected abstract Parse(text: string): Promise<TData>;

    /**
     * Dumps the `data` as a text representing the object.
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A text representing the `data`.
     */
    protected abstract Dump(data: TData): Promise<string>;
}
