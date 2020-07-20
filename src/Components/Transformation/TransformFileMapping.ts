import { IGeneratorSettings, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { parsePatch, createPatch, applyPatch } from "diff";
import { readFile } from "fs-extra";
import { FileMappingBase } from "../FileMappingBase";

/**
 * Provides a file-mapping which supports transformations while preserving spaces and newlines.
 */
export abstract class TransformFileMapping<T extends IGeneratorSettings> extends FileMappingBase<T>
{
    /**
     * The content of the file.
     */
    private content: string = null;

    /**
     * Initializes a new instance of the `TransformFileMapping<T>` class.
     */
    public constructor()
    {
        super();
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
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        generator.fs.write(await fileMapping.Destination, await this.ProcessContent(fileMapping, generator));
    }

    /**
     * Processes the content of the file.
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The new content of the file.
     */
    protected async ProcessContent(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        let originalContent = this.Content(fileMapping, generator);
        let emptyTransformationContent = this.EmptyTransformationContent(fileMapping, generator);
        let transformedContent = this.TransformedContent(fileMapping, generator);

        let patch = parsePatch(
            createPatch(
                await fileMapping.Source,
                await emptyTransformationContent,
                await originalContent,
                undefined,
                undefined,
                {
                    context: 1
                }))[0];

        let patchResult = applyPatch(await transformedContent, patch);

        if (typeof patchResult === "string")
        {
            return patchResult;
        }
        else
        {
            throw new Error("The patch couldn't be applied!");
        }
    }

    /**
     * Determines the original content of the file.
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
    protected async Content(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        if (this.content === null)
        {
            this.content = (await readFile(await fileMapping.Source)).toString();
        }

        return this.content;
    }

    /**
     * Computes the content without any transformation being applied.
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
        return this.Content(fileMapping, generator);
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
    protected async TransformedContent(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return this.Content(fileMapping, generator);
    }
}
