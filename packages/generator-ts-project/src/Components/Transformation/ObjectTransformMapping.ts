import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy object-notation code.
 */
export abstract class ObjectTransformMapping<TData, TSettings extends IGeneratorSettings> extends TransformFileMapping<TSettings>
{
    /**
     * Initializes a new instance of the `ObjectTransformMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings>)
    {
        super(generator);
    }

    /**
     * Gets the meta-data of the file.
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
    protected get EmptyTransformationContent(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Dump(await this.Metadata);
            })();
    }

    /**
     * @inheritdoc
     */
    protected get TransformedContent(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Dump(await this.Process(await this.Metadata));
            })();
    }

    /**
     * Processes the specified `metadata`.
     *
     * @param metadata
     * The meta-data to process.
     *
     * @returns
     * The processed meta-data.
     */
    protected async Process(metadata: TData): Promise<TData>
    {
        return metadata;
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
    protected abstract async Parse(text: string): Promise<TData>;

    /**
     * Dumps the `metadata` as a text representing the object.
     *
     * @param metadata
     * The metadata to dump.
     *
     * @returns
     * A text representing the `metadata`.
     */
    protected abstract async Dump(metadata: TData): Promise<string>;
}
