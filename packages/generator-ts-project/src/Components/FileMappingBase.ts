import { IFileMapping, FileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { readFile } from "fs-extra";
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
     * Gets the content of the source-file.
     */
    public get Content(): Promise<string>
    {
        return this.ReadSource();
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

    /**
     * Reads the contents of the file located at the specified `path`.
     *
     * @param path
     * The path to the file to read.
     *
     * @returns
     * The contents of the file.
     */
    protected async ReadFile(path: string): Promise<string>
    {
        return (await readFile(path)).toString();
    }

    /**
     * Reads the contents of the source-file.
     *
     * @returns
     * The contents of the source-file.
     */
    protected async ReadSource(): Promise<string>
    {
        return this.ReadFile(await this.Resolved.Source);
    }

    /**
     * Writes the specified `content` to the file located at the specified `path`.
     *
     * @param path
     * The path to the file to write.
     *
     * @param content
     * The content to write.
     */
    protected async WriteFile(path: string, content: string): Promise<void>
    {
        this.Generator.fs.write(path, content);
    }

    /**
     * Writes the specified `content` to the destination-file.
     *
     * @param content
     * The content to write.
     */
    protected async WriteDestination(content: string): Promise<void>
    {
        return this.WriteFile(await this.Resolved.Destination, content);
    }
}
