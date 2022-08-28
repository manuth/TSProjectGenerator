import { TempFileSystem } from "@manuth/temp-files";
import { FormatCodeSettings, Project, SourceFile } from "ts-morph";
import { TextConverter } from "./TextConverter.js";

/**
 * Provides the functionality to parse and dump `.ts`-code.
 */
export class TypeScriptConverter extends TextConverter<SourceFile>
{
    /**
     * The path the resulting code is supposed to be saved to.
     */
    private destinationPath: string;

    /**
     * The settings for formatting the code.
     */
    private formatSettings: FormatCodeSettings;

    /**
     * Initializes a new instance of the {@link TypeScriptConverter `TypeScriptConverter`} class.
     *
     * @param destinationPath
     * The path the resulting code is supposed to be saved to.
     */
    public constructor(destinationPath?: string)
    {
        super();
        this.destinationPath = destinationPath;

        this.formatSettings = {
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
     * Gets or sets the path the resulting code is supposed to be saved to.
     */
    public get DestinationPath(): string
    {
        return this.destinationPath;
    }

    /**
     * @inheritdoc
     */
    public set DestinationPath(value: string)
    {
        this.destinationPath = value;
    }

    /**
     * Gets or sets the settings for formatting the code.
     */
    public get FormatSettings(): FormatCodeSettings
    {
        return this.formatSettings;
    }

    /**
     * @inheritdoc
     */
    public set FormatSettings(value: FormatCodeSettings)
    {
        this.formatSettings = value;
    }

    /**
     * @inheritdoc
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public Parse(text: string): SourceFile
    {
        return new Project().createSourceFile(
            this.DestinationPath ?? TempFileSystem.TempName(),
            text,
            {
                overwrite: true
            });
    }

    /**
     * Dumps the specified {@link sourceFile `sourceFile`}.
     *
     * @param sourceFile
     * The source-file to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link sourceFile `sourceFile`}.
     */
    public Dump(sourceFile: SourceFile): string
    {
        sourceFile.formatText(this.FormatSettings);
        return sourceFile.getFullText();
    }
}
