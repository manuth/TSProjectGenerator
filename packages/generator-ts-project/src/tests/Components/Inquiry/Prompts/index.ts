import { basename } from "path";
import { NestedPromptTests } from "./NestedPrompt.test";
import { PromptBaseTests } from "./PromptBase.test";
import { QuestionSetPromptTests } from "./QuestionSetPrompt.test";
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
            PromptBaseTests();
            SuspendablePromptTests();
            NestedPromptTests();
            QuestionSetPromptTests();
        });
}
