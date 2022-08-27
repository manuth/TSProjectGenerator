import { EOL } from "os";
import { parse, stringify } from "comment-json";
import { split } from "eol";
import { TextConverter } from "./TextConverter";

/**
 * Provides the functionality to parse and dump `.json`-code.
 */
export class JSONCConverter<T> extends TextConverter<T>
{
    /**
     * The new-line character to use.
     */
    private eolCharacter = EOL;

    /**
     * A value indicating whether a new-line character should be appended to the end of the file.
     */
    private eolLast = true;

    /**
     * Initializes a new instance of the {@link JSONCConverter `JSONConverter`} class.
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
     * Gets or sets a value indicating whether a new-line character should be appended to the end of the file.
     */
    public get EOLLast(): boolean
    {
        return this.eolLast;
    }

    /**
     * @inheritdoc
     */
    public set EOLLast(value: boolean)
    {
        this.eolLast = value;
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
    public Parse(text: string): T
    {
        return parse(text) as any;
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
    public Dump(data: T): string
    {
        return [
            ...split(
                stringify(
                    data,
                    null,
                    4)),
            ...(
                this.EOLLast ?
                    [""] :
                    [])
        ].join(this.NewLineCharacter);
    }
}
