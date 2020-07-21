import { IGeneratorSettings, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TransformerFactory, transform, createSourceFile, ScriptTarget, ScriptKind, SourceFile, createPrinter } from "typescript";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy typescript-files.
 */
export abstract class TypeScriptTransformMapping<T extends IGeneratorSettings> extends TransformFileMapping<T>
{
    /**
     * Initializes a new instance of the `TypeScriptTransformMapping<T>` class.
     */
    public constructor()
    {
        super();
    }

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
    protected async EmptyTransformationContent(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return this.TransformCode(await this.Content(fileMapping, generator), []);
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
     * The transformed version of the original content.
     */
    protected async TransformedContent(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return this.TransformCode(await this.Content(fileMapping, generator), await this.GetTransformers(fileMapping, generator));
    }

    /**
     * Gets a set of components for transforming the file.
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
    protected abstract async GetTransformers(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<Array<TransformerFactory<SourceFile>>>;
}
