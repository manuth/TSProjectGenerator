import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
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
     * @param generator
     * The generator of the file-mapping.
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
    public constructor(generator: IGenerator<IGeneratorSettings>, content: string, emptyTransformationContent: string, transformedContent: string)
    {
        super(generator);
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
     */
    public get Destination(): Promise<string>
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    protected get Content(): Promise<string>
    {
        return (
            async () =>
            {
                return this.originalContent;
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
                return this.emptyTransformationContent;
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
                return this.transformedContent;
            })();
    }

    /**
     * @inheritdoc
     */
    public async Processor(): Promise<void>
    {
        this.result = await this.ProcessedContent;
    }
}
