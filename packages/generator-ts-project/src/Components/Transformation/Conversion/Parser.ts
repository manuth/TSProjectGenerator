import { IParser } from "./IParser";

/**
 * Provides the functionality to parse text.
 *
 * @template T
 * The type of the parsed text.
 */
export abstract class Parser<T> implements IParser<T>
{
    /**
     * Initializes a new instance of the {@link Parser `Parser<T>`}.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public abstract Parse(text: string): T;
}
