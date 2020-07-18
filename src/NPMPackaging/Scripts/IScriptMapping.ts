/**
 * Represents a script-mapping.
 */
export interface IScriptMapping
{
    /**
     * The source-script.
     */
    Source: string;

    /**
     * The name of the destination-script.
     */
    Destination: string;

    /**
     * A component for manipulating the script.
     *
     * @param script
     * The script to manipulate.
     *
     * @returns
     * The manipulated script.
     */
    Processor?(script: string): string;
}
