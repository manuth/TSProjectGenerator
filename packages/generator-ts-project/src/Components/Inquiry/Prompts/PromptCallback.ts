/**
 * Provides the functionality to resolve the result of a prompt.
 */
export type PromptCallback =
    /**
     * Resolves the result of a prompt.
     *
     * @param result
     * The result to resolve.
     */
    (result: any) => void;
