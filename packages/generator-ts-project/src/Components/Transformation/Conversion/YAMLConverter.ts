import { EOL } from "node:os";
import eol from "eol";
import { Document, parseAllDocuments } from "yaml";
import { IDumper } from "./IDumper.js";
import { TextConverter } from "./TextConverter.js";

const { split } = eol;

/**
 * Provides the functionality to parse and dump `.yaml`-code.
 */
export class YAMLConverter extends TextConverter<Document.Parsed[]> implements IDumper<Array<Document | Document.Parsed>>
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
    public Dump(data: Array<Document | Document.Parsed>): string
    {
        let result = split(
            data.map(
                (document, index) =>
                {
                    document.directives.docStart = (index > 0) ? true : document.directives.docStart;

                    return document.toString(
                        {
                            lineWidth: 0
                        });
                }).join("")).join(this.NewLineCharacter);

            return result;
    }
}
