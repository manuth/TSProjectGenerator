/**
 * Represents a component for transforming scripts.
 */
export type TestScriptTransformer =
    /**
     * Trnasforms a script.
     *
     * @param script
     * The script to transform.
     *
     * @returns
     * The transformed script.
     */
    (script: string) => string;
