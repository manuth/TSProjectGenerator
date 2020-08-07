import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
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
     * The transformers to apply.
     */
    private transformers: Array<TransformerFactory<SourceFile>>;

    /**
     * Initializes a new instance of the `TestTypeScriptTransformMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param content
     * The content to transform.
     *
     * @param transformers
     * The transformers to apply.
     */
    public constructor(generator: IGenerator<IGeneratorSettings>, content: string, transformers: Array<TransformerFactory<SourceFile>>)
    {
        super(generator);
        this.originalContent = content;
        this.transformers = transformers;
    }

    /**
     * Gets the transformers to apply.
     */
    public get Transformers(): Promise<Array<TransformerFactory<SourceFile>>>
    {
        return (
            async () =>
            {
                return this.transformers;
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return "test.ts";
            })();
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
}
