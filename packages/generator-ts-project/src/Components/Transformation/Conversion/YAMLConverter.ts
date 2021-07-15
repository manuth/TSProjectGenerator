import { EOL } from "os";
import { split } from "eol";
import { Document, parseAllDocuments, scalarOptions } from "yaml";
import { TextConverter } from "./TextConverter";

/**
 * Provides the functionality to parse and dump `.yaml`-code.
 */
export class YAMLConverter extends TextConverter<Document.Parsed[]>
{
    /**
     * The new-line character to use.
     */
    private eolCharacter = EOL;

    /**
     * Initializes a new instance of the {@link YAMLConverter `YAMLConverter`} class.
     */
    public constructor()
    {
        super();
    }

    /**
     * Gets or sets the new-line character to use.
     */
    public get NewLineCharacter(): string
    {
        return this.eolCharacter;
    }

    /**
     * @inheritdoc
     */
    public set NewLineCharacter(value: string)
    {
        this.eolCharacter = value;
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
    public Parse(text: string): Document.Parsed[]
    {
        return parseAllDocuments(text);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link data `data`}.
     */
    public Dump(data: Document.Parsed[]): string
    {
        return split(
            data.map(
                (document, index) =>
                {
                    let initialWidth = scalarOptions.str.fold.lineWidth;
                    scalarOptions.str.fold.lineWidth = 0;

                    try
                    {
                        document.directivesEndMarker = (index > 0) || document.directivesEndMarker;
                        return document.toString();
                    }
                    catch (e)
                    {
                        throw e;
                    }
                    finally
                    {
                        scalarOptions.str.fold.lineWidth = initialWidth;
                    }
                }).join("")).join(this.NewLineCharacter);
    }
}
