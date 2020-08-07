import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { TransformerFactory, transform, createSourceFile, ScriptTarget, ScriptKind, SourceFile, createPrinter } from "typescript";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy typescript-files.
 */
export abstract class TypeScriptTransformMapping<T extends IGeneratorSettings> extends TransformFileMapping<T>
{
    /**
     * Initializes a new instance of the `TypeScriptTransformMapping<T>` class.
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
    protected get EmptyTransformationContent(): Promise<string>
    {
        return (
            async () =>
            {
                return this.TransformCode(await this.Content, []);
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
                return this.TransformCode(await this.Content, await this.Transformers);
            })();
    }

    /**
     * Gets a set of components for transforming the file.
     */
    protected abstract get Transformers(): Promise<Array<TransformerFactory<SourceFile>>>;

    /**
     * Transforms the code.
     *
     * @param code
     * The code to transform.
     *
     * @param transformers
     * The transformations to apply.
     *
     * @returns
     * The transformed code.
     */
    protected async TransformCode(code: string, transformers: Array<TransformerFactory<SourceFile>>): Promise<string>
    {
        let fileName = ".ts";

        let transformResult = transform(
            createSourceFile(fileName, code, ScriptTarget.Latest, true, ScriptKind.TS),
            transformers);

        return createPrinter().printFile(
            transformResult.transformed.find((transformedFile) => transformedFile.fileName === fileName));
    }
}
