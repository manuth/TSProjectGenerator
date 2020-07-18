/**
 * Provides the functionality to process scripts.
 */
export type ScriptProcessor =
    /**
     * Processes a script.
     *
     * @param script
     * The script to process.
     *
     * @returns
     * The processed script.
     */
    (script: string) => string;
