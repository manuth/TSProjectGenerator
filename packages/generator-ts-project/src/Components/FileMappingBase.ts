import { IFileMapping, FileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Provides a basic implementation of the `IFileMapping<T>` interface.
 */
export abstract class FileMappingBase<T extends IGeneratorSettings> extends GeneratrorComponent<T, FileMapping<T>> implements IFileMapping<T>
{
    /**
     * Initializes a new instance of the `FileMappingBase<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
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
     * The destination of the file-mapping.
     */
    public abstract get Destination(): Promise<string>;

    /**
     * @inheritdoc
     */
    public get Resolved(): FileMapping<T>
    {
        return new FileMapping(this.Generator, this);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The context of the file-mapping.
     */
    public async Context(): Promise<any>
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public async Processor?(): Promise<void>;
}
