import { IDumper } from "./IDumper";
import { Parser } from "./Parser";

/**
 * Provides the functionality to parse and dump text.
 *
 * @template T
 * The type of the data to convert.
 */
export abstract class TextConverter<T> extends Parser<T> implements IDumper<T>
{
    /**
     * Initializes a new instance of the {@link TextConverter `TextConverter<T>`} class.
     */
    public constructor()
    {
        super();
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
    public abstract Dump(data: T): string;
}
