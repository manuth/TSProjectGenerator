import { basename } from "path";
import { TestPromptTests } from "./TestPrompt.test.js";

/**
 * Registers tests for inquiry-components.
 */
export function InquiryTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TestPromptTests();
        });
}
