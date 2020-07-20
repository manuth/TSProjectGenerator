import { IFileMapping, FileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Provides a basic implementation of the `IFileMapping<T>` interface.
 */
export abstract class FileMappingBase<T extends IGeneratorSettings> implements IFileMapping<T>
{
    /**
     * Initializes a new instance of the `FileMappingBase<T>` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return null;
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The context of the file-mapping.
     */
    public async Context(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<any>
    {
        return null;
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The file-mapping to process.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public async Processor?(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>;

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public abstract async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>;
}
