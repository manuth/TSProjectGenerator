import { basename } from "node:path";
import { ArrayPromptTests } from "./ArrayPrompt.test.js";
import { NestedPromptTests } from "./NestedPrompt.test.js";
import { PathPromptTests } from "./PathPrompt.test.js";
import { PromptBaseTests } from "./PromptBase.test.js";
import { QuestionSetPromptTests } from "./QuestionSetPrompt.test.js";
import { SubGeneratorPromptTests } from "./SubGeneratorPrompt.test.js";
import { SuspendablePromptTests } from "./SuspendablePrompt.test.js";

/**
 * Registers tests for prompts.
 */
export function PromptTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            PromptBaseTests();
            SuspendablePromptTests();
            NestedPromptTests();
            QuestionSetPromptTests();
            ArrayPromptTests();
            SubGeneratorPromptTests();
            PathPromptTests();
        });
}
