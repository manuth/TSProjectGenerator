import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FormatCodeSettings, Project, SourceFile } from "ts-morph";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy typescript-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class TypeScriptTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TransformFileMapping<TSettings, TOptions, SourceFile>
{
    /**
     * Initializes a new instance of the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets the settings for formatting the code.
     */
    protected get FormatSettings(): FormatCodeSettings
    {
        return {
            convertTabsToSpaces: true,
            ensureNewLineAtEndOfFile: true,
            indentSize: 4,
            insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
            placeOpenBraceOnNewLineForControlBlocks: true,
            placeOpenBraceOnNewLineForFunctions: true,
            tabSize: 4,
            trimTrailingWhitespace: true
        };
    }

    /**
     * @inheritdoc
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the specified {@link text `text`}.
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
     * Dumps the specified {@link sourceFile `sourceFile`} as a text representing the object.
     *
     * @param sourceFile
     * The source-file to dump.
     *
     * @returns
     * A text representing the {@link sourceFile `sourceFile`}.
     */
    protected async Dump(sourceFile: SourceFile): Promise<string>
    {
        sourceFile.formatText(this.FormatSettings);
        return sourceFile.getFullText();
    }
}
