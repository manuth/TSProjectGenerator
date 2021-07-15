/**
 * Provides the functionality to dump text.
 */
export interface IDumper<T>
{
    /**
     * Dumps the specified {@link data `data`}.
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link data `data`}.
     */
    Dump(data: T): string;
}
