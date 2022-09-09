// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ArrayPrompt } from "./ArrayPrompt.js";

/**
 * Represents an answer-hash which is used by the {@link ArrayPrompt `ArrayPrompt<TQuestion, TItem>`} class.
 */
export interface IArrayPromptHash
{
    /**
     * A value indicating whether the current item is correct.
     */
    correct?: boolean;

    /**
     * A value indicating whether another array-item should be added.
     */
    addNew?: boolean;
}
