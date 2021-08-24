/**
 * Provides the functionality to parse text.
 */
export interface IParser<T>
{
    /**
     * Parses the specified {@link text `text`}.
     *
     * @param text
     * The data to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    Parse(text: string): T;
}
