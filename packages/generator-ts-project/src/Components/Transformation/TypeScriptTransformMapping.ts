import { GeneratorOptions, IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { SourceFile, Project } from "ts-morph";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy typescript-files.
 */
export abstract class TypeScriptTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TransformFileMapping<TSettings, TOptions, SourceFile>
{
    /**
     * Initializes a new instance of the `TypeScriptTransformMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Loads the meta-data from the `text`.
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the `text`.
     */
    protected async Parse(text: string): Promise<SourceFile>
    {
        let project = new Project();

        return project.createSourceFile(
            this.Resolved.Source,
            text,
            {
                overwrite: true
            });
    }

    /**
     * Dumps the `data` as a text representing the object.
     *
     * @param sourceFile
     * The source-file to dump.
     *
     * @returns
     * A text representing the `data`.
     */
    protected async Dump(sourceFile: SourceFile): Promise<string>
    {
        return sourceFile.getFullText();
    }
}
