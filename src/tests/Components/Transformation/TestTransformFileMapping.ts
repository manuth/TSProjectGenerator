import { IGeneratorSettings, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TransformFileMapping } from "../../../Components/Transformation/TransformFileMapping";

/**
 * Provides an implementation of the `TransformFileMapping` class for testing.
 */
export class TestTransformFileMapping extends TransformFileMapping<IGeneratorSettings>
{
    /**
     * The original content.
     */
    public originalContent: string;

    /**
     * The original content without any transformation being applied.
     */
    public emptyTransformationContent: string;

    /**
     * The transformed version of the original content.
     */
    public transformedContent: string;

    /**
     * The result of the file-mapping.
     */
    private result: string;

    /**
     * Initializes a new instance of the `TestTransformFileMapping` class.
     *
     * @param content
     * The original content.
     *
     * @param emptyTransformationContent
     * The original content without any transformation being applied.
     *
     * @param transformedContent
     * The transformed version of the original content.
     */
    public constructor(content: string, emptyTransformationContent: string, transformedContent: string)
    {
        super();
        this.originalContent = content;
        this.emptyTransformationContent = emptyTransformationContent;
        this.transformedContent = transformedContent;
    }

    /**
     * Gets the result of the last execution.
     */
    public get Result(): string
    {
        return this.result;
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
     * The original content without any transformation being applied.
     */
    protected async EmptyTransformationContent(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<string>
    {
        return this.emptyTransformationContent;
    }

    /**
     * Computes the content with all transformations being applied.
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The transformed version of the original content.
     */
    protected async TransformedContent(fileMapping: FileMapping<IGeneratorSettings>, generator: IGenerator<IGeneratorSettings>): Promise<string>
    {
        return this.transformedContent;
    }
}
