import { IGeneratorSettings, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TransformerFactory, SourceFile } from "typescript";
import { TypeScriptTransformMapping } from "../../../Components/Transformation/TypeScriptTransformMapping";

/**
 * Provides an implementation of the `TypeScriptTransformMapping<T>` class for testing.
 */
export class TestTypeScriptTransformMapping extends TypeScriptTransformMapping<IGeneratorSettings>
{
    /**
     * The original content.
     */
    public originalContent: string;

    /**
     * The result of the file-mapping.
     */
    private result: string;

    /**
     * The transformers to apply.
     */
    private transformers: Array<TransformerFactory<SourceFile>>;

    /**
     * Initializes a new instance of the `TestTypeScriptTransformMapping` class.
     *
     * @param content
     * The content to transform.
     *
     * @param transformers
     * The transformers to apply.
     */
    public constructor(content: string, transformers: Array<TransformerFactory<SourceFile>>)
    {
        super();
        this.originalContent = content;
        this.Transformers = transformers;
    }

    /**
     * Gets the result of the last execution.
     */
    public get Result(): string
    {
        return this.result;
    }

    /**
     * Gets the transformers to apply.
     */
    public get Transformers(): Array<TransformerFactory<SourceFile>>
    {
        return this.transformers;
    }

    /**
     * @inheritdoc
     */
    public set Transformers(value: Array<TransformerFactory<SourceFile>>)
    {
        this.transformers = value;
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public async Processor(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<void>
    {
        this.result = await this.ProcessContent(fileMapping, generator);
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
    public async Destination(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<string>
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
     * The original content of the file.
     */
    protected async Content(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<string>
    {
        return this.originalContent;
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
     * A set of components for transforming the file.
     */
    protected async GetTransformers(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<Array<TransformerFactory<SourceFile>>>
    {
        return this.Transformers;
    }
}
