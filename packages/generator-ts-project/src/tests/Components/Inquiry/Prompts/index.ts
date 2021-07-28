import { basename } from "path";
import { ArrayPromptTests } from "./ArrayPrompt.test";
import { NestedPromptTests } from "./NestedPrompt.test";
import { PromptBaseTests } from "./PromptBase.test";
import { QuestionSetPromptTests } from "./QuestionSetPrompt.test";
import { SubGeneratorPromptTests } from "./SubGeneratorPrompt.test";
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
            ArrayPromptTests();
            SubGeneratorPromptTests();
        });
}
