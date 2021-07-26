import { basename } from "path";
import { NestedPromptTests } from "./NestedPrompt.test";

/**
 * Registers tests for prompts.
 */
export function PromptTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            NestedPromptTests();
        });
}
