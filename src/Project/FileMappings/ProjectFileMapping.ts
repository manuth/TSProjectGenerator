import { IFileMapping, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../ITSProjectSettings";

/**
 * Provides a file-mapping for a `TSProject`.
 */
export abstract class ProjectFileMapping<T extends ITSProjectSettings> implements IFileMapping<T>
{
    /**
     * Initializes a new instance of the `ESLintRCFileMapping` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
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
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
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
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public abstract async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>;
}
