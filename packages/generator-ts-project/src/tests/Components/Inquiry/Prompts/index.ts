import { basename } from "path";
import { NestedPromptTests } from "./NestedPrompt.test";
import { SuspendablePromptTests } from "./SuspendablePrompt.test";

/**
 * Registers tests for prompts.
 */
export function PromptTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            SuspendablePromptTests();
            NestedPromptTests();
        });
}
